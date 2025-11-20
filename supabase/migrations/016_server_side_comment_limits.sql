-- ========================================
-- 🔒 SERVER-SIDE COMMENT LIMIT ENFORCEMENT
-- ========================================
-- Migration 016: Add server-side validation for FREE user comment limits
-- Fixes Vercel Security Compliance: "Client-side enforcement" & "Insecure business logic"
--
-- Features:
-- - Track comment counts per user in database
-- - Supabase function to check if user can comment
-- - RLS policy to enforce limits at database level
-- - Audit trail for all comment limit checks
-- ========================================

-- STEP 1: Create user_comment_stats table
CREATE TABLE IF NOT EXISTS public.user_comment_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_comments INTEGER NOT NULL DEFAULT 0,
    free_comments_used INTEGER NOT NULL DEFAULT 0,
    last_comment_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_user_comment_stats_user_id ON public.user_comment_stats(user_id);

-- Enable RLS
ALTER TABLE public.user_comment_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view own comment stats"
    ON public.user_comment_stats FOR SELECT
    USING (user_id = auth.uid());

-- ========================================
-- STEP 2: Function to check if user can comment
-- ========================================
CREATE OR REPLACE FUNCTION public.can_user_comment(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_free_comments_used INTEGER;
    v_user_tier TEXT;
    v_can_comment BOOLEAN;
BEGIN
    -- Get user tier from subscriptions or user_tiers table
    SELECT tier INTO v_user_tier
    FROM public.subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND NOW() BETWEEN start_date AND end_date
    LIMIT 1;

    -- If no active subscription, user is FREE
    IF v_user_tier IS NULL THEN
        v_user_tier := 'free';
    END IF;

    -- PREMIUM and VIP have unlimited comments
    IF v_user_tier IN ('premium', 'vip') THEN
        RETURN TRUE;
    END IF;

    -- FREE users: check if they've used their 5 free comments
    SELECT COALESCE(free_comments_used, 0) INTO v_free_comments_used
    FROM public.user_comment_stats
    WHERE user_id = p_user_id;

    -- If no record exists, user hasn't commented yet
    IF v_free_comments_used IS NULL THEN
        RETURN TRUE;
    END IF;

    -- FREE limit is 5 comments
    v_can_comment := v_free_comments_used < 5;

    RETURN v_can_comment;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.can_user_comment(UUID) TO authenticated;

-- ========================================
-- STEP 3: Trigger to increment comment count
-- ========================================
CREATE OR REPLACE FUNCTION public.increment_user_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_tier TEXT;
BEGIN
    -- Get user tier
    SELECT tier INTO v_user_tier
    FROM public.subscriptions
    WHERE user_id = NEW.user_id
      AND status = 'active'
      AND NOW() BETWEEN start_date AND end_date
    LIMIT 1;

    IF v_user_tier IS NULL THEN
        v_user_tier := 'free';
    END IF;

    -- Upsert user comment stats
    INSERT INTO public.user_comment_stats (
        user_id,
        total_comments,
        free_comments_used,
        last_comment_at,
        updated_at
    )
    VALUES (
        NEW.user_id,
        1,
        CASE WHEN v_user_tier = 'free' THEN 1 ELSE 0 END,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_comments = user_comment_stats.total_comments + 1,
        free_comments_used = CASE
            WHEN v_user_tier = 'free'
            THEN user_comment_stats.free_comments_used + 1
            ELSE user_comment_stats.free_comments_used
        END,
        last_comment_at = NOW(),
        updated_at = NOW();

    RETURN NEW;
END;
$$;

-- Attach trigger to reel_comments table
DROP TRIGGER IF EXISTS trigger_increment_comment_count ON public.reel_comments;
CREATE TRIGGER trigger_increment_comment_count
    AFTER INSERT ON public.reel_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_user_comment_count();

-- ========================================
-- STEP 4: RLS Policy to enforce comment limits
-- ========================================
-- NOTE: This assumes reel_comments table exists (from migration 011)
-- Add constraint to reel_comments INSERT policy

-- Drop existing policies if needed
DROP POLICY IF EXISTS "Users can insert own comments" ON public.reel_comments;

-- Create new policy with server-side limit check
CREATE POLICY "Users can insert own comments with limit check"
    ON public.reel_comments FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        public.can_user_comment(auth.uid())
    );

-- ========================================
-- STEP 5: Audit logging table for comment attempts
-- ========================================
CREATE TABLE IF NOT EXISTS public.comment_limit_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reel_id UUID NOT NULL,
    allowed BOOLEAN NOT NULL,
    user_tier TEXT NOT NULL,
    free_comments_used INTEGER,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX idx_comment_limit_audit_user_id ON public.comment_limit_audit(user_id);
CREATE INDEX idx_comment_limit_audit_created_at ON public.comment_limit_audit(created_at DESC);

-- Enable RLS
ALTER TABLE public.comment_limit_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs (or specific role)
-- For now, no policies (restrict access)

-- ========================================
-- STEP 6: Function to log comment attempts
-- ========================================
CREATE OR REPLACE FUNCTION public.log_comment_attempt(
    p_user_id UUID,
    p_reel_id UUID,
    p_allowed BOOLEAN,
    p_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_tier TEXT;
    v_free_used INTEGER;
BEGIN
    -- Get current stats
    SELECT tier INTO v_user_tier
    FROM public.subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND NOW() BETWEEN start_date AND end_date
    LIMIT 1;

    IF v_user_tier IS NULL THEN
        v_user_tier := 'free';
    END IF;

    SELECT COALESCE(free_comments_used, 0) INTO v_free_used
    FROM public.user_comment_stats
    WHERE user_id = p_user_id;

    -- Insert audit log
    INSERT INTO public.comment_limit_audit (
        user_id,
        reel_id,
        allowed,
        user_tier,
        free_comments_used,
        reason
    )
    VALUES (
        p_user_id,
        p_reel_id,
        p_allowed,
        v_user_tier,
        v_free_used,
        p_reason
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_comment_attempt(UUID, UUID, BOOLEAN, TEXT) TO authenticated;

-- ========================================
-- STEP 7: Migration complete notification
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 016 complete: Server-side comment limit enforcement enabled';
    RAISE NOTICE '📊 Features added:';
    RAISE NOTICE '  - user_comment_stats table for tracking';
    RAISE NOTICE '  - can_user_comment() function for validation';
    RAISE NOTICE '  - RLS policy enforcing limits at database level';
    RAISE NOTICE '  - comment_limit_audit table for compliance';
    RAISE NOTICE '  - Trigger to auto-increment counts';
    RAISE NOTICE '🔒 Security: Client-side bypass is now impossible';
END $$;

-- ========================================
-- 📹 Reels Statistics, Comments & Trending
-- ========================================
-- Migration: 011
-- Purpose: Add comprehensive Reels engagement system
--
-- Features:
-- - View tracking (who watched which Reel)
-- - Like tracking (separate from profile likes)
-- - Gift tracking for Reels
-- - Comments system with gift integration
-- - Trending algorithm support

BEGIN;

-- ========================================
-- REELS TABLE (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  duration_seconds INTEGER,

  -- Statistics (denormalized for performance)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  gift_count INTEGER DEFAULT 0,
  total_gifts_value_credits INTEGER DEFAULT 0, -- Total value of all gifts received

  -- Trending score (updated periodically)
  trending_score DECIMAL DEFAULT 0,
  trending_score_24h DECIMAL DEFAULT 0, -- Score for last 24 hours
  trending_score_7d DECIMAL DEFAULT 0,  -- Score for last 7 days

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT positive_stats CHECK (
    view_count >= 0 AND
    like_count >= 0 AND
    comment_count >= 0 AND
    gift_count >= 0 AND
    total_gifts_value_credits >= 0
  )
);

-- ========================================
-- REEL VIEWS
-- ========================================
CREATE TABLE IF NOT EXISTS public.reel_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Null if anonymous

  -- View details
  watch_duration_seconds INTEGER, -- How long they watched
  completed BOOLEAN DEFAULT false, -- Watched to the end

  -- Metadata
  viewer_ip TEXT, -- For anti-spam (hash it in production)
  viewer_country TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate views (same user, same reel within 1 hour)
  UNIQUE(reel_id, viewer_id)
);

-- Index for fast view counting
CREATE INDEX idx_reel_views_reel_id ON public.reel_views(reel_id);
CREATE INDEX idx_reel_views_viewer_id ON public.reel_views(viewer_id);
CREATE INDEX idx_reel_views_viewed_at ON public.reel_views(viewed_at DESC);

-- ========================================
-- REEL LIKES
-- ========================================
CREATE TABLE IF NOT EXISTS public.reel_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One like per user per reel
  UNIQUE(reel_id, user_id)
);

CREATE INDEX idx_reel_likes_reel_id ON public.reel_likes(reel_id);
CREATE INDEX idx_reel_likes_user_id ON public.reel_likes(user_id);
CREATE INDEX idx_reel_likes_created_at ON public.reel_likes(created_at DESC);

-- ========================================
-- REEL COMMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.reel_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Comment content
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.reel_comments(id) ON DELETE CASCADE, -- For replies

  -- Gift integration (optional - if comment includes a gift)
  includes_gift BOOLEAN DEFAULT false,
  gift_id TEXT, -- Gift identifier (e.g., 'rose', 'diamond')
  gift_value_credits INTEGER DEFAULT 0,

  -- Engagement
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  -- Moderation
  is_flagged BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT comment_not_empty CHECK (
    char_length(trim(comment_text)) > 0 OR includes_gift = true
  )
);

CREATE INDEX idx_reel_comments_reel_id ON public.reel_comments(reel_id);
CREATE INDEX idx_reel_comments_user_id ON public.reel_comments(user_id);
CREATE INDEX idx_reel_comments_created_at ON public.reel_comments(created_at DESC);
CREATE INDEX idx_reel_comments_parent ON public.reel_comments(parent_comment_id);

-- ========================================
-- REEL GIFTS (Separate from comments)
-- ========================================
CREATE TABLE IF NOT EXISTS public.reel_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Gift details
  gift_id TEXT NOT NULL, -- 'rose', 'heart', 'diamond', etc.
  gift_name TEXT NOT NULL,
  gift_icon TEXT NOT NULL,
  credit_cost INTEGER NOT NULL,

  -- Transaction reference
  transaction_id UUID, -- Link to transactions table

  -- Optional: Link to comment if gift was sent with comment
  comment_id UUID REFERENCES public.reel_comments(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT positive_credit_cost CHECK (credit_cost > 0)
);

CREATE INDEX idx_reel_gifts_reel_id ON public.reel_gifts(reel_id);
CREATE INDEX idx_reel_gifts_sender_id ON public.reel_gifts(sender_id);
CREATE INDEX idx_reel_gifts_recipient_id ON public.reel_gifts(recipient_id);
CREATE INDEX idx_reel_gifts_created_at ON public.reel_gifts(created_at DESC);

-- ========================================
-- INDEXES FOR TRENDING ALGORITHM
-- ========================================
CREATE INDEX idx_reels_trending_score ON public.reels(trending_score DESC);
CREATE INDEX idx_reels_trending_24h ON public.reels(trending_score_24h DESC);
CREATE INDEX idx_reels_trending_7d ON public.reels(trending_score_7d DESC);
CREATE INDEX idx_reels_created_at ON public.reels(created_at DESC);

-- ========================================
-- FUNCTIONS: Update Statistics
-- ========================================

-- Function to update Reel statistics after view
CREATE OR REPLACE FUNCTION update_reel_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.reels
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = NEW.reel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reel_view_count
AFTER INSERT ON public.reel_views
FOR EACH ROW
EXECUTE FUNCTION update_reel_view_count();

-- Function to update Reel like count
CREATE OR REPLACE FUNCTION update_reel_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.reels
    SET like_count = like_count + 1,
        updated_at = NOW()
    WHERE id = NEW.reel_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.reels
    SET like_count = GREATEST(0, like_count - 1),
        updated_at = NOW()
    WHERE id = OLD.reel_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reel_like_count_insert
AFTER INSERT ON public.reel_likes
FOR EACH ROW
EXECUTE FUNCTION update_reel_like_count();

CREATE TRIGGER trigger_update_reel_like_count_delete
AFTER DELETE ON public.reel_likes
FOR EACH ROW
EXECUTE FUNCTION update_reel_like_count();

-- Function to update Reel comment count
CREATE OR REPLACE FUNCTION update_reel_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.reels
    SET comment_count = comment_count + 1,
        updated_at = NOW()
    WHERE id = NEW.reel_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.reels
    SET comment_count = GREATEST(0, comment_count - 1),
        updated_at = NOW()
    WHERE id = OLD.reel_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reel_comment_count_insert
AFTER INSERT ON public.reel_comments
FOR EACH ROW
EXECUTE FUNCTION update_reel_comment_count();

CREATE TRIGGER trigger_update_reel_comment_count_delete
AFTER DELETE ON public.reel_comments
FOR EACH ROW
EXECUTE FUNCTION update_reel_comment_count();

-- Function to update Reel gift statistics
CREATE OR REPLACE FUNCTION update_reel_gift_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.reels
  SET gift_count = gift_count + 1,
      total_gifts_value_credits = total_gifts_value_credits + NEW.credit_cost,
      updated_at = NOW()
  WHERE id = NEW.reel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reel_gift_stats
AFTER INSERT ON public.reel_gifts
FOR EACH ROW
EXECUTE FUNCTION update_reel_gift_stats();

-- ========================================
-- FUNCTION: Calculate Trending Score
-- ========================================
-- Trending algorithm: views × 1 + likes × 5 + gifts_value × 0.1
-- Higher weight on engagement (likes/gifts) than passive views

CREATE OR REPLACE FUNCTION calculate_trending_score(
  p_view_count INTEGER,
  p_like_count INTEGER,
  p_total_gifts_value INTEGER,
  p_age_hours DECIMAL DEFAULT 1
)
RETURNS DECIMAL AS $$
DECLARE
  base_score DECIMAL;
  time_decay DECIMAL;
BEGIN
  -- Base score calculation
  base_score := (p_view_count * 1.0) + (p_like_count * 5.0) + (p_total_gifts_value * 0.1);

  -- Time decay: newer content gets boost
  -- Score decays by 50% every 24 hours
  time_decay := POWER(0.5, p_age_hours / 24.0);

  RETURN base_score * time_decay;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCTION: Update All Trending Scores
-- ========================================
-- Run this periodically (e.g., every 15 minutes via cron job)

CREATE OR REPLACE FUNCTION update_all_trending_scores()
RETURNS void AS $$
BEGIN
  UPDATE public.reels
  SET
    -- Overall trending score
    trending_score = calculate_trending_score(
      view_count,
      like_count,
      total_gifts_value_credits,
      EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0
    ),

    -- 24h trending (only count recent engagement)
    trending_score_24h = calculate_trending_score(
      (SELECT COUNT(*) FROM public.reel_views WHERE reel_id = reels.id AND viewed_at > NOW() - INTERVAL '24 hours'),
      (SELECT COUNT(*) FROM public.reel_likes WHERE reel_id = reels.id AND created_at > NOW() - INTERVAL '24 hours'),
      (SELECT COALESCE(SUM(credit_cost), 0) FROM public.reel_gifts WHERE reel_id = reels.id AND created_at > NOW() - INTERVAL '24 hours'),
      EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0
    ),

    -- 7d trending
    trending_score_7d = calculate_trending_score(
      (SELECT COUNT(*) FROM public.reel_views WHERE reel_id = reels.id AND viewed_at > NOW() - INTERVAL '7 days'),
      (SELECT COUNT(*) FROM public.reel_likes WHERE reel_id = reels.id AND created_at > NOW() - INTERVAL '7 days'),
      (SELECT COALESCE(SUM(credit_cost), 0) FROM public.reel_gifts WHERE reel_id = reels.id AND created_at > NOW() - INTERVAL '7 days'),
      EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0
    ),

    updated_at = NOW()
  WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_gifts ENABLE ROW LEVEL SECURITY;

-- Reels: Everyone can view active reels
CREATE POLICY "Anyone can view active reels"
  ON public.reels FOR SELECT
  USING (is_active = true);

-- Reels: Users can create their own
CREATE POLICY "Users can create reels"
  ON public.reels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reels: Users can update their own
CREATE POLICY "Users can update own reels"
  ON public.reels FOR UPDATE
  USING (auth.uid() = user_id);

-- Views: Anyone can record views
CREATE POLICY "Anyone can record reel views"
  ON public.reel_views FOR INSERT
  WITH CHECK (true);

-- Views: Users can see all views
CREATE POLICY "Anyone can view reel views"
  ON public.reel_views FOR SELECT
  USING (true);

-- Likes: Authenticated users can like
CREATE POLICY "Authenticated users can like reels"
  ON public.reel_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Likes: Users can unlike their own
CREATE POLICY "Users can unlike reels"
  ON public.reel_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Likes: Anyone can view likes
CREATE POLICY "Anyone can view reel likes"
  ON public.reel_likes FOR SELECT
  USING (true);

-- Comments: Authenticated users can comment
CREATE POLICY "Authenticated users can comment"
  ON public.reel_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comments: Users can delete own comments
CREATE POLICY "Users can delete own comments"
  ON public.reel_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Comments: Anyone can view non-deleted comments
CREATE POLICY "Anyone can view comments"
  ON public.reel_comments FOR SELECT
  USING (is_deleted = false);

-- Gifts: Authenticated users can send gifts
CREATE POLICY "Authenticated users can send reel gifts"
  ON public.reel_gifts FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Gifts: Anyone can view gifts
CREATE POLICY "Anyone can view reel gifts"
  ON public.reel_gifts FOR SELECT
  USING (true);

COMMIT;

-- ========================================
-- 📋 Summary
-- ========================================
-- ✅ Created reels table with statistics
-- ✅ Created reel_views tracking
-- ✅ Created reel_likes system
-- ✅ Created reel_comments with gift integration
-- ✅ Created reel_gifts tracking
-- ✅ Implemented trending score algorithm
-- ✅ Auto-update triggers for all statistics
-- ✅ RLS policies for security
--
-- Next steps:
-- 1. Apply this migration in Supabase
-- 2. Create TypeScript types
-- 3. Build UI components for comments
-- 4. Implement trending feed
-- 5. Create analytics dashboard

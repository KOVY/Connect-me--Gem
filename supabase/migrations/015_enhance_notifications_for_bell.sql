-- ========================================
-- 🔔 ENHANCE NOTIFICATIONS FOR BELL SYSTEM
-- ========================================
-- Migration: 015
-- Purpose: Add actor_id, link, and additional notification types for in-app bell

BEGIN;

-- ========================================
-- ADD NEW COLUMNS
-- ========================================

-- Add actor_id (who triggered the notification)
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add link (where notification should redirect)
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS link TEXT;

-- Create index on actor_id
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON public.notifications(actor_id);

-- ========================================
-- EXTEND NOTIFICATION TYPES
-- ========================================

-- Drop existing check constraint
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add new check constraint with extended types
ALTER TABLE public.notifications
ADD CONSTRAINT notifications_type_check CHECK (type IN (
  -- Existing types
  'gift_received',
  'match',
  'message',
  'like',
  'payout_request',
  'payout_approved',
  'payout_rejected',
  'admin_alert',
  'system',
  -- New types for bell notifications
  'like_group',         -- Multiple likes grouped together
  'profile_view',       -- Someone viewed your profile
  'follower',           -- New follower
  'boost_activated',    -- Boost was activated
  'premium_activated',  -- Premium subscription activated
  'story_view',         -- Someone viewed your story
  'story_like',         -- Someone liked your story
  'comment',            -- New comment on your content
  'mention'             -- Someone mentioned you
));

-- ========================================
-- UPDATE HELPER FUNCTION
-- ========================================

-- Drop old function
DROP FUNCTION IF EXISTS create_notification(UUID, TEXT, TEXT, TEXT, JSONB, BOOLEAN);

-- Create enhanced version
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL,
  p_is_admin BOOLEAN DEFAULT false,
  p_actor_id UUID DEFAULT NULL,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data,
    is_admin,
    actor_id,
    link
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_data,
    p_is_admin,
    p_actor_id,
    p_link
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ENABLE REALTIME
-- ========================================

-- Enable realtime for notifications table (if not already enabled)
-- Note: This requires superuser privileges, run manually in Supabase dashboard if needed
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ========================================
-- CLEANUP OLD NOTIFICATIONS
-- ========================================

-- Create function to auto-delete old read notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE is_read = true
    AND read_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Note: Set up a cron job to run this periodically (e.g., daily)
-- Example using pg_cron (if available):
-- SELECT cron.schedule('cleanup-notifications', '0 3 * * *', 'SELECT cleanup_old_notifications();');

-- ========================================
-- NOTIFICATION GROUPING HELPERS
-- ========================================

-- Function to group similar notifications
CREATE OR REPLACE FUNCTION group_similar_notifications(
  p_user_id UUID,
  p_type TEXT,
  p_time_window INTERVAL DEFAULT '1 hour'
)
RETURNS TABLE (
  notification_ids UUID[],
  actor_ids UUID[],
  count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ARRAY_AGG(n.id) as notification_ids,
    ARRAY_AGG(DISTINCT n.actor_id) FILTER (WHERE n.actor_id IS NOT NULL) as actor_ids,
    COUNT(*)::INTEGER as count
  FROM public.notifications n
  WHERE n.user_id = p_user_id
    AND n.type = p_type
    AND n.is_read = false
    AND n.created_at > NOW() - p_time_window
  GROUP BY n.user_id, n.type
  HAVING COUNT(*) > 1;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ========================================
-- 📋 Summary
-- ========================================
-- ✅ Added actor_id column (who triggered notification)
-- ✅ Added link column (deep linking)
-- ✅ Extended notification types (profile_view, follower, boost, etc.)
-- ✅ Updated create_notification function
-- ✅ Added cleanup function for old notifications
-- ✅ Added grouping helper function
--
-- Manual steps required:
-- 1. Enable realtime in Supabase dashboard:
--    Settings → API → Realtime → Enable for 'notifications' table
--
-- 2. Optionally set up cron job for cleanup:
--    SELECT cron.schedule('cleanup-notifications', '0 3 * * *', 'SELECT cleanup_old_notifications();');

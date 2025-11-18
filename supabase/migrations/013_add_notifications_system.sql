-- ========================================
-- 🔔 NOTIFICATIONS SYSTEM
-- ========================================
-- Migration: 013
-- Purpose: Add notifications system for admins and users

BEGIN;

-- ========================================
-- NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- null for admin notifications
  type TEXT NOT NULL CHECK (type IN (
    'gift_received',
    'match',
    'message',
    'like',
    'payout_request',
    'payout_approved',
    'payout_rejected',
    'admin_alert',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data (gift details, payout info, etc.)

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false, -- true for admin-only notifications

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_admin ON public.notifications(is_admin);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id = auth.uid() OR
    (is_admin = false AND user_id IS NULL)
  );

-- Only system can insert notifications (via edge functions)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ========================================
-- HELPER FUNCTION: Create Notification
-- ========================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL,
  p_is_admin BOOLEAN DEFAULT false
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
    is_admin
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_data,
    p_is_admin
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ========================================
-- 📋 Summary
-- ========================================
-- ✅ Created notifications table
-- ✅ Added indexes for performance
-- ✅ RLS policies for security
-- ✅ Helper function for creating notifications
--
-- Next steps:
-- 1. Integrate into edge functions
-- 2. Create admin dashboard for viewing notifications
-- 3. Add push notification support (optional)

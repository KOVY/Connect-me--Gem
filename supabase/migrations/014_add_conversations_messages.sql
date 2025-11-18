-- ========================================
-- 💬 UNIFIED CONVERSATIONS & MESSAGES SYSTEM
-- ========================================
-- Migration: 014
-- Purpose: Create unified chat system that integrates:
--   - Reels gifts → Conversations
--   - Reels comments → Conversations
--   - Direct messages → Conversations
--   - All interactions visible in Messages page
--
-- This creates ONE source of truth for all user-to-user communication

BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CONVERSATIONS TABLE
-- ========================================
-- Represents a conversation between two users
-- Automatically created when:
--   1. User sends gift in Reels
--   2. User sends gift from profile
--   3. User sends first message

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants (always ordered: lower UUID first for consistency)
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Last message preview (for Messages list)
  last_message_text TEXT,
  last_message_type TEXT DEFAULT 'text', -- 'text', 'gift', 'system'
  last_message_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unread counts (for each participant)
  unread_count_p1 INTEGER DEFAULT 0, -- Unread for participant1
  unread_count_p2 INTEGER DEFAULT 0, -- Unread for participant2

  -- Metadata
  is_archived_p1 BOOLEAN DEFAULT false,
  is_archived_p2 BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure participants are different and ordered
  CONSTRAINT different_participants CHECK (participant1_id != participant2_id),
  CONSTRAINT ordered_participants CHECK (participant1_id < participant2_id),

  -- One conversation per pair
  UNIQUE(participant1_id, participant2_id)
);

CREATE INDEX idx_conversations_p1 ON public.conversations(participant1_id, last_message_at DESC);
CREATE INDEX idx_conversations_p2 ON public.conversations(participant2_id, last_message_at DESC);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- ========================================
-- MESSAGES TABLE
-- ========================================
-- All messages in a conversation
-- Can originate from:
--   - Direct chat
--   - Reel gift
--   - Reel comment with gift

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,

  -- Sender/recipient
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'gift', 'system'
  message_text TEXT,

  -- Gift details (if message_type = 'gift')
  gift_id TEXT,
  gift_name TEXT,
  gift_icon TEXT,
  gift_value_credits INTEGER DEFAULT 0,

  -- Link to reel interaction (if message originated from reel)
  reel_id UUID REFERENCES public.reels(id) ON DELETE SET NULL,
  reel_gift_id UUID REFERENCES public.reel_gifts(id) ON DELETE SET NULL,
  reel_comment_id UUID REFERENCES public.reel_comments(id) ON DELETE SET NULL,

  -- Read status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT message_has_content CHECK (
    message_text IS NOT NULL OR message_type = 'gift'
  )
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_reel_gift ON public.messages(reel_gift_id) WHERE reel_gift_id IS NOT NULL;

-- ========================================
-- HELPER FUNCTION: Get or Create Conversation
-- ========================================
-- Ensures conversation exists between two users
-- Returns conversation_id

CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user1_id UUID,
  p_user2_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_conv_id UUID;
  v_p1 UUID;
  v_p2 UUID;
BEGIN
  -- Order participants (lower UUID first)
  IF p_user1_id < p_user2_id THEN
    v_p1 := p_user1_id;
    v_p2 := p_user2_id;
  ELSE
    v_p1 := p_user2_id;
    v_p2 := p_user1_id;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO v_conv_id
  FROM public.conversations
  WHERE participant1_id = v_p1 AND participant2_id = v_p2;

  -- If not found, create new
  IF v_conv_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (v_p1, v_p2)
    RETURNING id INTO v_conv_id;
  END IF;

  RETURN v_conv_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGER: Create Message When Reel Gift Sent
-- ========================================
-- When user sends gift in Reels, automatically:
--   1. Create/find conversation
--   2. Create message in conversation

CREATE OR REPLACE FUNCTION create_message_from_reel_gift()
RETURNS TRIGGER AS $$
DECLARE
  v_conv_id UUID;
BEGIN
  -- Get or create conversation
  v_conv_id := get_or_create_conversation(NEW.sender_id, NEW.recipient_id);

  -- Create message
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    recipient_id,
    message_type,
    message_text,
    gift_id,
    gift_name,
    gift_icon,
    gift_value_credits,
    reel_id,
    reel_gift_id
  ) VALUES (
    v_conv_id,
    NEW.sender_id,
    NEW.recipient_id,
    'gift',
    NULL, -- Gift messages don't have text
    NEW.gift_id,
    NEW.gift_name,
    NEW.gift_icon,
    NEW.credit_cost,
    NEW.reel_id,
    NEW.id
  );

  -- Update conversation last_message
  UPDATE public.conversations
  SET
    last_message_text = NEW.gift_name,
    last_message_type = 'gift',
    last_message_at = NEW.created_at,
    -- Increment unread for recipient
    unread_count_p1 = CASE
      WHEN participant1_id = NEW.recipient_id THEN unread_count_p1 + 1
      ELSE unread_count_p1
    END,
    unread_count_p2 = CASE
      WHEN participant2_id = NEW.recipient_id THEN unread_count_p2 + 1
      ELSE unread_count_p2
    END,
    updated_at = NOW()
  WHERE id = v_conv_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_message_from_reel_gift
AFTER INSERT ON public.reel_gifts
FOR EACH ROW
EXECUTE FUNCTION create_message_from_reel_gift();

-- ========================================
-- TRIGGER: Update Conversation on New Message
-- ========================================
-- When message is created directly (not from reel gift trigger)

CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run if message was NOT created by reel_gift trigger
  -- (reel_gift trigger already updates conversation)
  IF NEW.reel_gift_id IS NULL THEN
    UPDATE public.conversations
    SET
      last_message_text = COALESCE(NEW.message_text, NEW.gift_name, 'System message'),
      last_message_type = NEW.message_type,
      last_message_at = NEW.created_at,
      -- Increment unread for recipient
      unread_count_p1 = CASE
        WHEN participant1_id = NEW.recipient_id THEN unread_count_p1 + 1
        ELSE unread_count_p1
      END,
      unread_count_p2 = CASE
        WHEN participant2_id = NEW.recipient_id THEN unread_count_p2 + 1
        ELSE unread_count_p2
      END,
      updated_at = NOW()
    WHERE id = NEW.conversation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();

-- ========================================
-- FUNCTION: Mark Messages as Read
-- ========================================
-- Call this when user opens a conversation

CREATE OR REPLACE FUNCTION mark_messages_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Mark all messages from other person as read
  UPDATE public.messages
  SET is_read = true, read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND recipient_id = p_user_id
    AND is_read = false;

  -- Reset unread count for this user
  UPDATE public.conversations
  SET
    unread_count_p1 = CASE WHEN participant1_id = p_user_id THEN 0 ELSE unread_count_p1 END,
    unread_count_p2 = CASE WHEN participant2_id = p_user_id THEN 0 ELSE unread_count_p2 END,
    updated_at = NOW()
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can view conversations they're part of
CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Conversations: System can insert (via triggers)
CREATE POLICY "System can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (true);

-- Conversations: Participants can update (archive, etc.)
CREATE POLICY "Participants can update conversations"
  ON public.conversations FOR UPDATE
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

-- Messages: Users can send messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Messages: Users can update their own messages (mark as read)
CREATE POLICY "Users can update their messages"
  ON public.messages FOR UPDATE
  USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

COMMIT;

-- ========================================
-- 📋 SUMMARY
-- ========================================
-- ✅ Created conversations table (unified chat list)
-- ✅ Created messages table (all messages)
-- ✅ Auto-create conversation when reel gift sent
-- ✅ Auto-create message when reel gift sent
-- ✅ Unread count tracking
-- ✅ Last message preview for Messages page
-- ✅ RLS policies for security
--
-- INTEGRATION:
-- ✅ Reel gifts → Automatically create conversation + message
-- ⏳ Reel comments with gifts → Add trigger (optional)
-- ⏳ Direct chat → Use get_or_create_conversation()
-- ⏳ MessagesPage → Query conversations table
--
-- Next steps:
-- 1. Apply this migration in Supabase
-- 2. Update MessagesPage to query conversations
-- 3. Update ChatPage to create messages
-- 4. Add reply functionality to ReelCommentsPanel

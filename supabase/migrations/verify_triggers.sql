-- ========================================
-- 🔍 VERIFY REELS GIFT TRIGGERS
-- ========================================
-- This script verifies that the triggers for Reels gifts → Messages
-- are properly set up in your Supabase database.
--
-- Run this in Supabase SQL Editor to check if triggers exist
-- and create them if they don't.

-- ========================================
-- STEP 1: Verify Tables Exist
-- ========================================

-- Check if conversations table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'conversations'
    ) THEN
        RAISE EXCEPTION 'Table "conversations" does not exist. Please run migration 014_add_conversations_messages.sql first.';
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'messages'
    ) THEN
        RAISE EXCEPTION 'Table "messages" does not exist. Please run migration 014_add_conversations_messages.sql first.';
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'reel_gifts'
    ) THEN
        RAISE EXCEPTION 'Table "reel_gifts" does not exist. Please run migration 011_add_reels_stats_comments_trending.sql first.';
    END IF;

    RAISE NOTICE '✅ All required tables exist.';
END $$;

-- ========================================
-- STEP 2: Verify Helper Function Exists
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'get_or_create_conversation'
    ) THEN
        RAISE WARNING '⚠️ Function "get_or_create_conversation" does not exist. Creating it now...';

        -- Create the function
        CREATE OR REPLACE FUNCTION get_or_create_conversation(
          p_user1_id UUID,
          p_user2_id UUID
        )
        RETURNS UUID AS $func$
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
        $func$ LANGUAGE plpgsql;

        RAISE NOTICE '✅ Created function "get_or_create_conversation"';
    ELSE
        RAISE NOTICE '✅ Function "get_or_create_conversation" exists.';
    END IF;
END $$;

-- ========================================
-- STEP 3: Verify Trigger Function Exists
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'create_message_from_reel_gift'
    ) THEN
        RAISE WARNING '⚠️ Function "create_message_from_reel_gift" does not exist. Creating it now...';

        -- Create the trigger function
        CREATE OR REPLACE FUNCTION create_message_from_reel_gift()
        RETURNS TRIGGER AS $func$
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
        $func$ LANGUAGE plpgsql;

        RAISE NOTICE '✅ Created function "create_message_from_reel_gift"';
    ELSE
        RAISE NOTICE '✅ Function "create_message_from_reel_gift" exists.';
    END IF;
END $$;

-- ========================================
-- STEP 4: Verify Trigger Exists
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = 'trigger_create_message_from_reel_gift'
        AND tgrelid = 'public.reel_gifts'::regclass
    ) THEN
        RAISE WARNING '⚠️ Trigger "trigger_create_message_from_reel_gift" does not exist. Creating it now...';

        -- Create the trigger
        CREATE TRIGGER trigger_create_message_from_reel_gift
        AFTER INSERT ON public.reel_gifts
        FOR EACH ROW
        EXECUTE FUNCTION create_message_from_reel_gift();

        RAISE NOTICE '✅ Created trigger "trigger_create_message_from_reel_gift"';
    ELSE
        RAISE NOTICE '✅ Trigger "trigger_create_message_from_reel_gift" exists.';
    END IF;
END $$;

-- ========================================
-- STEP 5: Verify Other Triggers
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'update_conversation_on_message'
    ) THEN
        RAISE WARNING '⚠️ Function "update_conversation_on_message" does not exist. Creating it now...';

        -- Create the function
        CREATE OR REPLACE FUNCTION update_conversation_on_message()
        RETURNS TRIGGER AS $func$
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
        $func$ LANGUAGE plpgsql;

        RAISE NOTICE '✅ Created function "update_conversation_on_message"';
    ELSE
        RAISE NOTICE '✅ Function "update_conversation_on_message" exists.';
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = 'trigger_update_conversation_on_message'
        AND tgrelid = 'public.messages'::regclass
    ) THEN
        RAISE WARNING '⚠️ Trigger "trigger_update_conversation_on_message" does not exist. Creating it now...';

        -- Create the trigger
        CREATE TRIGGER trigger_update_conversation_on_message
        AFTER INSERT ON public.messages
        FOR EACH ROW
        EXECUTE FUNCTION update_conversation_on_message();

        RAISE NOTICE '✅ Created trigger "trigger_update_conversation_on_message"';
    ELSE
        RAISE NOTICE '✅ Trigger "trigger_update_conversation_on_message" exists.';
    END IF;
END $$;

-- ========================================
-- STEP 6: Test Query
-- ========================================
-- Run these queries to test if everything is working

-- Check recent conversations
SELECT
    c.id,
    c.last_message_text,
    c.last_message_type,
    c.last_message_at,
    c.unread_count_p1,
    c.unread_count_p2
FROM public.conversations c
ORDER BY c.last_message_at DESC
LIMIT 10;

-- Check recent reel gifts and their corresponding messages
SELECT
    rg.id as gift_id,
    rg.gift_name,
    rg.sender_id,
    rg.recipient_id,
    rg.created_at as gift_sent_at,
    m.id as message_id,
    m.conversation_id,
    m.created_at as message_created_at
FROM public.reel_gifts rg
LEFT JOIN public.messages m ON m.reel_gift_id = rg.id
ORDER BY rg.created_at DESC
LIMIT 10;

-- ========================================
-- ✅ VERIFICATION COMPLETE
-- ========================================

SELECT '✅ All triggers verified and created if missing!' as status;

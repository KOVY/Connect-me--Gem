# 🚀 How to Apply Migration 014: Unified Conversations System

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **Connect-me--Gem**
3. Click **SQL Editor** in the left sidebar
4. Click **"+ New query"**

## Step 2: Copy the Migration SQL

Open this file and copy **ALL of it**:
```
/home/user/Connect-me--Gem/supabase/migrations/014_add_conversations_messages.sql
```

## Step 3: Paste and Run

1. Paste the entire SQL into the editor
2. Click **"RUN"** (or press Cmd/Ctrl + Enter)
3. Wait for it to complete (should take 5-10 seconds)

## Step 4: Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('conversations', 'messages')
ORDER BY table_name;
```

You should see:
- `conversations`
- `messages`

## Step 5: Verify Triggers Were Created

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%message%'
  AND trigger_schema = 'public';
```

You should see:
- `trigger_create_message_from_reel_gift` on table `reel_gifts`
- `trigger_update_conversation_on_message` on table `messages`

---

## ⚠️ Troubleshooting

### Error: "column conversation_id does not exist"

This means the `messages` table wasn't created. Possible causes:

1. **You didn't run the full migration** - Make sure you copied ALL 358 lines
2. **An earlier error stopped the migration** - Check the error log for the first error
3. **Missing UUID extension** - The migration now includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Error: "relation public.conversations does not exist"

The `conversations` table wasn't created. This usually means:
- There was an error in the `BEGIN;` transaction
- You need to run the entire script, not just parts

### Error: "function get_or_create_conversation does not exist"

The helper function wasn't created. Again, run the ENTIRE migration file.

---

## ✅ What This Migration Does

1. **Creates `conversations` table** - Stores all user-to-user conversations
2. **Creates `messages` table** - Stores all messages (text, gifts, system messages)
3. **Automatically creates conversation when:**
   - User sends gift in Reels → Conversation appears in Messages
   - User sends direct message → Conversation created
4. **Triggers:**
   - When reel gift sent → Auto-create conversation + message
   - When message sent → Update conversation's last_message preview
5. **Real-time updates:**
   - MessagesPage subscribes to conversation changes
   - New gifts in Reels instantly appear in Messages

---

## 🧪 Test It Works

After applying the migration:

1. **Send a gift in Reels** (as a logged-in user)
2. **Check Messages page** - You should see a new conversation with that user
3. **Click the conversation** - Opens ChatPage with that user
4. **Send a message** - Gets saved to Supabase `messages` table

---

## Need Help?

If you see errors, please share:
1. The **full error message** (including error code like `42703`)
2. **Which line** the error occurred on
3. **What you were doing** (running migration, using the app, etc.)

# AI Profile System - SLM Integration Guide

## Overview
AI profiles simulate real conversations using a Small Language Model (SLM). Users won't know they're chatting with AI - creating a more engaging onboarding experience.

## Architecture

### 1. AI Profile Detection
- 50/50 mix of AI vs Real profiles in discovery feed
- Flag: `is_ai_profile: boolean` in `user_profiles` table
- Tracked separately in `user_daily_limits` (ai_messages_today vs real_messages_today)

### 2. SLM Model Options

#### Option A: Google Gemini Nano (Recommended)
- **Free** - runs in browser via Chrome AI API
- **Fast** - on-device inference
- **Private** - no data sent to servers
- **Limitation**: Chrome 127+ only

#### Option B: Anthropic Claude Haiku
- **Best quality** conversations
- **Cost**: $0.25 per 1M input tokens
- **Speed**: ~200ms response time

#### Option C: Mistral 7B via Replicate
- **Good quality** at lower cost
- **Cost**: $0.05 per 1M tokens
- **Speed**: ~500ms response time

## Implementation

### Database Schema

```sql
-- Add AI profile flag to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_ai_profile BOOLEAN DEFAULT FALSE;

-- AI conversation history for context
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_profile_id UUID NOT NULL REFERENCES user_profiles(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  messages JSONB[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ai_profile_id, user_id)
);
```

### AI Response Generation

```typescript
// src/lib/aiProfiles.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateAIResponse(
  aiProfile: AIProfile,
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are ${aiProfile.name}, ${aiProfile.age} years old.
Bio: ${aiProfile.bio}
Personality: ${aiProfile.personality}
Interests: ${aiProfile.interests.join(', ')}

Previous conversation:
${conversationHistory.map(m => `${m.sender}: ${m.text}`).join('\\n')}

User: ${userMessage}

Respond naturally as ${aiProfile.name}. Keep it flirty, friendly, and engaging.
Use emojis occasionally. Keep responses under 100 characters.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
```

### Integration Points

1. **Message Send** (`ChatPage.tsx`)
   - Check if target profile is AI
   - Generate AI response after 2-5 second delay
   - Send response back to user

2. **Cooldown System**
   - AI profiles bypass cooldowns for user (but user still has limits)
   - Creates illusion of availability

3. **Monetization Hook**
   - After 5-10 messages, AI says "I need to go, but send me a gift to keep chatting! 💖"
   - Drives gift purchases

## Setup Instructions

### 1. Create AI Profiles

```sql
-- Generate 50 AI profiles
INSERT INTO user_profiles (
  id,
  name,
  age,
  bio,
  interests,
  location,
  profile_picture_url,
  is_ai_profile,
  personality
) VALUES
  -- Add 50 realistic profiles here
  (gen_random_uuid(), 'Emma', 24, 'Coffee addict ☕ Love hiking and yoga', ARRAY['fitness', 'travel', 'yoga'], 'Prague', '/ai-profiles/emma.jpg', true, 'outgoing'),
  -- ... more profiles
```

### 2. Environment Variables

```env
# Gemini API (recommended)
VITE_GEMINI_API_KEY=your_key_here

# OR Anthropic Claude
VITE_ANTHROPIC_API_KEY=your_key_here

# OR Mistral via Replicate
VITE_REPLICATE_API_KEY=your_key_here
```

### 3. Enable AI Features

```typescript
// Feature flag
export const AI_PROFILES_ENABLED = import.meta.env.VITE_AI_PROFILES_ENABLED === 'true';

// Mix ratio (0.5 = 50/50)
export const AI_PROFILE_MIX_RATIO = 0.5;
```

## Best Practices

1. **Response Timing**
   - Add 2-5 second random delay before AI responds
   - Simulates typing indicator

2. **Personality Consistency**
   - Store conversation history
   - Use context in prompts

3. **Natural Errors**
   - Occasionally misspell words
   - Use casual language
   - Add "haha", "lol", etc.

4. **Engagement Triggers**
   - Ask questions back
   - Show interest in user's profile
   - Suggest activities

5. **Monetization Nudges**
   - "Gotta run, but send me a coffee to keep chatting! ☕"
   - "I'd love to keep talking... maybe you could send me a rose? 🌹"

## Testing

```bash
# Test AI response generation
npm run test:ai-profiles

# Manual test in browser
- Open DevTools Console
- aiProfiles.generateResponse('Hi there!')
```

## Privacy & Ethics

- Clearly disclose in Terms of Service that some profiles are AI
- Allow users to opt-out of AI conversations
- Never collect sensitive personal information through AI chats
- Respect user privacy - don't store conversations long-term

## Cost Estimation

### Gemini Nano (Free tier)
- 0 cost - runs locally in browser

### Gemini Pro (Paid)
- ~500 tokens per conversation
- $0.0005 per 1K tokens
- 1000 conversations = $0.25

### Recommended: Gemini Nano + Gemini Pro fallback
- Use Nano for Chrome users (free)
- Fall back to Gemini Pro for other browsers
- Average cost: $0.10 per 1000 conversations

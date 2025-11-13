-- Migration: User Tiers & Message Limits System
-- Description: Implements 4-tier monetization strategy (Anonymous, FREE, Premium, VIP)
-- with cooldowns, daily limits, and smart messaging system

-- Create ENUM for user tiers
CREATE TYPE user_tier AS ENUM ('anonymous', 'free', 'premium', 'vip');

-- Create ENUM for subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Extend user_profiles with tier information
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS tier user_tier DEFAULT 'anonymous',
ADD COLUMN IF NOT EXISTS subscription_status subscription_status DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT DEFAULT NULL;

-- Create user_daily_limits table (tracks daily usage)
CREATE TABLE IF NOT EXISTS user_daily_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Swipe limits
  swipes_today INTEGER DEFAULT 0,
  swipes_limit INTEGER DEFAULT 5, -- 5 for anonymous, unlimited for others

  -- Message limits
  messages_today INTEGER DEFAULT 0,
  messages_limit INTEGER DEFAULT 3, -- 3 for anonymous, 20 for free, unlimited for premium/vip
  ai_messages_today INTEGER DEFAULT 0, -- Track AI vs real (secret)
  real_messages_today INTEGER DEFAULT 0,

  -- Super likes
  super_likes_today INTEGER DEFAULT 0,
  super_likes_limit INTEGER DEFAULT 0, -- 0 for anon/free, 5 for premium, 10 for vip

  -- Boosts (VIP only)
  boosts_this_month INTEGER DEFAULT 0,
  boosts_limit INTEGER DEFAULT 0, -- 5 for VIP

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- Create message_cooldowns table (tracks per-profile cooldowns)
CREATE TABLE IF NOT EXISTS message_cooldowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  target_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Cooldown tracking
  messages_sent_today INTEGER DEFAULT 0,
  messages_limit_per_profile INTEGER DEFAULT 3, -- Max 2-3 messages per profile for FREE
  last_message_sent_at TIMESTAMPTZ DEFAULT NOW(),
  cooldown_until TIMESTAMPTZ DEFAULT NULL, -- 3 hours cooldown
  cooldown_24h_until TIMESTAMPTZ DEFAULT NULL, -- 24h cooldown after 2-3 messages

  -- Unlock status (via gift)
  unlocked_until TIMESTAMPTZ DEFAULT NULL, -- Unlocked with gift
  unlock_type TEXT DEFAULT NULL, -- 'coffee' (+10 messages), 'rose' (24h unlimited), 'diamond' (7d unlimited)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, target_profile_id)
);

-- Create user_subscriptions_history table
CREATE TABLE IF NOT EXISTS user_subscriptions_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tier user_tier NOT NULL,
  subscription_status subscription_status NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ DEFAULT NULL,
  stripe_subscription_id TEXT,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_daily_limits_user_date ON user_daily_limits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_message_cooldowns_user ON message_cooldowns(user_id);
CREATE INDEX IF NOT EXISTS idx_message_cooldowns_target ON message_cooldowns(target_profile_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_history_user ON user_subscriptions_history(user_id);

-- Function: Get current tier limits for a user
CREATE OR REPLACE FUNCTION get_user_tier_limits(p_user_id UUID)
RETURNS TABLE(
  tier user_tier,
  swipes_limit INTEGER,
  messages_limit INTEGER,
  super_likes_limit INTEGER,
  boosts_limit INTEGER,
  can_send_gifts BOOLEAN,
  gift_fee_percentage INTEGER,
  has_ads BOOLEAN,
  can_see_who_liked BOOLEAN
) AS $$
DECLARE
  v_tier user_tier;
BEGIN
  -- Get user's current tier
  SELECT user_profiles.tier INTO v_tier
  FROM user_profiles
  WHERE id = p_user_id;

  -- Return limits based on tier
  RETURN QUERY
  SELECT
    v_tier as tier,
    CASE v_tier
      WHEN 'anonymous' THEN 5
      ELSE 999999 -- Unlimited
    END as swipes_limit,
    CASE v_tier
      WHEN 'anonymous' THEN 3
      WHEN 'free' THEN 20
      ELSE 999999 -- Unlimited for premium/vip
    END as messages_limit,
    CASE v_tier
      WHEN 'premium' THEN 5
      WHEN 'vip' THEN 10
      ELSE 0
    END as super_likes_limit,
    CASE v_tier
      WHEN 'vip' THEN 5
      ELSE 0
    END as boosts_limit,
    CASE v_tier
      WHEN 'anonymous' THEN FALSE
      ELSE TRUE -- FREE+ can send gifts
    END as can_send_gifts,
    CASE v_tier
      WHEN 'free' THEN 60 -- 60% platform fee
      WHEN 'premium' THEN 50 -- 50% platform fee
      WHEN 'vip' THEN 30 -- 30% platform fee
      ELSE 60
    END as gift_fee_percentage,
    CASE v_tier
      WHEN 'free' THEN TRUE
      ELSE FALSE -- Premium/VIP no ads
    END as has_ads,
    CASE v_tier
      WHEN 'premium' THEN TRUE
      WHEN 'vip' THEN TRUE
      ELSE FALSE
    END as can_see_who_liked;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user can send message (cooldown logic)
CREATE OR REPLACE FUNCTION can_send_message(
  p_user_id UUID,
  p_target_profile_id UUID
)
RETURNS TABLE(
  can_send BOOLEAN,
  reason TEXT,
  cooldown_until TIMESTAMPTZ,
  messages_remaining INTEGER
) AS $$
DECLARE
  v_tier user_tier;
  v_daily_messages INTEGER;
  v_daily_limit INTEGER;
  v_cooldown_record RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Get user tier and daily messages
  SELECT up.tier, udl.messages_today, udl.messages_limit
  INTO v_tier, v_daily_messages, v_daily_limit
  FROM user_profiles up
  LEFT JOIN user_daily_limits udl ON up.id = udl.user_id AND udl.date = CURRENT_DATE
  WHERE up.id = p_user_id;

  -- Premium/VIP have unlimited messages
  IF v_tier IN ('premium', 'vip') THEN
    RETURN QUERY SELECT TRUE, 'unlimited'::TEXT, NULL::TIMESTAMPTZ, 999999;
    RETURN;
  END IF;

  -- Check daily limit
  IF v_daily_messages >= v_daily_limit THEN
    RETURN QUERY SELECT FALSE, 'daily_limit_reached'::TEXT, NULL::TIMESTAMPTZ, 0;
    RETURN;
  END IF;

  -- Check cooldown with this specific profile
  SELECT * INTO v_cooldown_record
  FROM message_cooldowns
  WHERE user_id = p_user_id AND target_profile_id = p_target_profile_id;

  IF v_cooldown_record IS NOT NULL THEN
    -- Check if unlocked via gift
    IF v_cooldown_record.unlocked_until IS NOT NULL AND v_cooldown_record.unlocked_until > v_now THEN
      RETURN QUERY SELECT TRUE, 'unlocked_with_gift'::TEXT, NULL::TIMESTAMPTZ, 999;
      RETURN;
    END IF;

    -- Check 24h cooldown (after 2-3 messages)
    IF v_cooldown_record.cooldown_24h_until IS NOT NULL AND v_cooldown_record.cooldown_24h_until > v_now THEN
      RETURN QUERY SELECT FALSE, 'profile_cooldown_24h'::TEXT, v_cooldown_record.cooldown_24h_until, 0;
      RETURN;
    END IF;

    -- Check 3h cooldown
    IF v_cooldown_record.cooldown_until IS NOT NULL AND v_cooldown_record.cooldown_until > v_now THEN
      RETURN QUERY SELECT FALSE, 'profile_cooldown_3h'::TEXT, v_cooldown_record.cooldown_until, 0;
      RETURN;
    END IF;

    -- Check messages per profile limit (2-3 messages)
    IF v_cooldown_record.messages_sent_today >= v_cooldown_record.messages_limit_per_profile THEN
      RETURN QUERY SELECT FALSE, 'profile_daily_limit'::TEXT, v_cooldown_record.cooldown_24h_until, 0;
      RETURN;
    END IF;
  END IF;

  -- Can send message
  RETURN QUERY SELECT TRUE, 'ok'::TEXT, NULL::TIMESTAMPTZ, (v_daily_limit - v_daily_messages);
END;
$$ LANGUAGE plpgsql;

-- Function: Record message sent (update limits and cooldowns)
CREATE OR REPLACE FUNCTION record_message_sent(
  p_user_id UUID,
  p_target_profile_id UUID,
  p_is_ai_profile BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
DECLARE
  v_messages_sent INTEGER;
BEGIN
  -- Update daily limits
  INSERT INTO user_daily_limits (user_id, date, messages_today, ai_messages_today, real_messages_today)
  VALUES (
    p_user_id,
    CURRENT_DATE,
    1,
    CASE WHEN p_is_ai_profile THEN 1 ELSE 0 END,
    CASE WHEN p_is_ai_profile THEN 0 ELSE 1 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    messages_today = user_daily_limits.messages_today + 1,
    ai_messages_today = user_daily_limits.ai_messages_today + CASE WHEN p_is_ai_profile THEN 1 ELSE 0 END,
    real_messages_today = user_daily_limits.real_messages_today + CASE WHEN p_is_ai_profile THEN 0 ELSE 1 END,
    updated_at = NOW();

  -- Update cooldowns for this profile
  INSERT INTO message_cooldowns (user_id, target_profile_id, messages_sent_today, last_message_sent_at, cooldown_until)
  VALUES (
    p_user_id,
    p_target_profile_id,
    1,
    NOW(),
    NOW() + INTERVAL '3 hours' -- 3h cooldown
  )
  ON CONFLICT (user_id, target_profile_id)
  DO UPDATE SET
    messages_sent_today = message_cooldowns.messages_sent_today + 1,
    last_message_sent_at = NOW(),
    cooldown_until = NOW() + INTERVAL '3 hours',
    -- Set 24h cooldown if reached limit (2-3 messages)
    cooldown_24h_until = CASE
      WHEN message_cooldowns.messages_sent_today + 1 >= message_cooldowns.messages_limit_per_profile
      THEN NOW() + INTERVAL '24 hours'
      ELSE message_cooldowns.cooldown_24h_until
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Upgrade user tier
CREATE OR REPLACE FUNCTION upgrade_user_tier(
  p_user_id UUID,
  p_new_tier user_tier,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL,
  p_duration_months INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  -- Update user profile
  UPDATE user_profiles
  SET
    tier = p_new_tier,
    subscription_status = 'active',
    subscription_started_at = NOW(),
    subscription_expires_at = NOW() + (p_duration_months || ' months')::INTERVAL,
    stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
    stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Record in history
  INSERT INTO user_subscriptions_history (
    user_id,
    tier,
    subscription_status,
    started_at,
    ended_at,
    stripe_subscription_id
  ) VALUES (
    p_user_id,
    p_new_tier,
    'active',
    NOW(),
    NOW() + (p_duration_months || ' months')::INTERVAL,
    p_stripe_subscription_id
  );
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE user_daily_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_cooldowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions_history ENABLE ROW LEVEL SECURITY;

-- Users can read their own limits
CREATE POLICY "Users can view own daily limits"
  ON user_daily_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own cooldowns
CREATE POLICY "Users can view own cooldowns"
  ON message_cooldowns FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own subscription history
CREATE POLICY "Users can view own subscription history"
  ON user_subscriptions_history FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert/update (via functions)
CREATE POLICY "System can manage daily limits"
  ON user_daily_limits FOR ALL
  USING (true);

CREATE POLICY "System can manage cooldowns"
  ON message_cooldowns FOR ALL
  USING (true);

CREATE POLICY "System can manage subscription history"
  ON user_subscriptions_history FOR ALL
  USING (true);

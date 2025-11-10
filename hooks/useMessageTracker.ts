import { useState, useEffect } from 'react';

const MESSAGE_LIMIT_KEY = 'aura_message_limit';
const COOLDOWN_KEY = 'aura_cooldowns';
const DAILY_MESSAGE_LIMIT = 10;
const COOLDOWN_HOURS = 3;
const MAX_MESSAGES_PER_PROFILE_PER_DAY = 3;

interface MessageCount {
  count: number;
  lastReset: string;
  profileMessages: Record<string, number>; // profileId -> count
}

interface Cooldown {
  profileId: string;
  expiresAt: string;
}

export interface MessageTrackerState {
  dailyMessagesRemaining: number;
  canMessageProfile: (profileId: string) => boolean;
  getCooldownTime: (profileId: string) => number; // minutes remaining
  incrementMessage: (profileId: string) => void;
  hasDailyLimit: boolean;
  hasProfileCooldown: (profileId: string) => boolean;
  getProfileMessagesRemaining: (profileId: string) => number;
}

/**
 * Hook for tracking message limits and cooldowns for FREE users
 *
 * Rules:
 * - 10 messages per day total (AI + real profiles)
 * - 3 hour cooldown between messages to same profile
 * - Max 3 messages per profile per day
 * - Resets at midnight
 */
export function useMessageTracker(
  userTier: 'free' | 'premium' | 'vip',
  isAuthenticated: boolean
): MessageTrackerState {
  const [messageCount, setMessageCount] = useState<MessageCount>({
    count: 0,
    lastReset: new Date().toISOString(),
    profileMessages: {}
  });
  const [cooldowns, setCooldowns] = useState<Cooldown[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated || userTier !== 'free') {
      return;
    }

    const savedCount = localStorage.getItem(MESSAGE_LIMIT_KEY);
    const savedCooldowns = localStorage.getItem(COOLDOWN_KEY);

    if (savedCount) {
      const parsed: MessageCount = JSON.parse(savedCount);
      const lastReset = new Date(parsed.lastReset);
      const now = new Date();

      // Reset if it's a new day
      if (now.getDate() !== lastReset.getDate() ||
          now.getMonth() !== lastReset.getMonth() ||
          now.getFullYear() !== lastReset.getFullYear()) {
        setMessageCount({
          count: 0,
          lastReset: now.toISOString(),
          profileMessages: {}
        });
        localStorage.setItem(MESSAGE_LIMIT_KEY, JSON.stringify({
          count: 0,
          lastReset: now.toISOString(),
          profileMessages: {}
        }));
      } else {
        setMessageCount(parsed);
      }
    }

    if (savedCooldowns) {
      const parsed: Cooldown[] = JSON.parse(savedCooldowns);
      // Filter out expired cooldowns
      const activeCooldowns = parsed.filter(c => new Date(c.expiresAt) > new Date());
      setCooldowns(activeCooldowns);
      localStorage.setItem(COOLDOWN_KEY, JSON.stringify(activeCooldowns));
    }
  }, [isAuthenticated, userTier]);

  const canMessageProfile = (profileId: string): boolean => {
    // Premium and VIP have unlimited messages
    if (userTier !== 'free') {
      return true;
    }

    // Check daily limit
    if (messageCount.count >= DAILY_MESSAGE_LIMIT) {
      return false;
    }

    // Check profile-specific limit
    const profileCount = messageCount.profileMessages[profileId] || 0;
    if (profileCount >= MAX_MESSAGES_PER_PROFILE_PER_DAY) {
      return false;
    }

    // Check cooldown
    const cooldown = cooldowns.find(c => c.profileId === profileId);
    if (cooldown && new Date(cooldown.expiresAt) > new Date()) {
      return false;
    }

    return true;
  };

  const hasProfileCooldown = (profileId: string): boolean => {
    if (userTier !== 'free') {
      return false;
    }

    const cooldown = cooldowns.find(c => c.profileId === profileId);
    return cooldown ? new Date(cooldown.expiresAt) > new Date() : false;
  };

  const getCooldownTime = (profileId: string): number => {
    if (userTier !== 'free') {
      return 0;
    }

    const cooldown = cooldowns.find(c => c.profileId === profileId);
    if (!cooldown) return 0;

    const now = new Date();
    const expires = new Date(cooldown.expiresAt);
    const diff = expires.getTime() - now.getTime();

    return Math.max(0, Math.ceil(diff / (1000 * 60))); // minutes
  };

  const getProfileMessagesRemaining = (profileId: string): number => {
    if (userTier !== 'free') {
      return 999; // Unlimited for premium/vip
    }

    const used = messageCount.profileMessages[profileId] || 0;
    return Math.max(0, MAX_MESSAGES_PER_PROFILE_PER_DAY - used);
  };

  const incrementMessage = (profileId: string) => {
    if (userTier !== 'free' || !isAuthenticated) {
      return;
    }

    const newCount: MessageCount = {
      count: messageCount.count + 1,
      lastReset: messageCount.lastReset,
      profileMessages: {
        ...messageCount.profileMessages,
        [profileId]: (messageCount.profileMessages[profileId] || 0) + 1
      }
    };

    setMessageCount(newCount);
    localStorage.setItem(MESSAGE_LIMIT_KEY, JSON.stringify(newCount));

    // Add cooldown
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + COOLDOWN_HOURS);

    const newCooldown: Cooldown = {
      profileId,
      expiresAt: expiresAt.toISOString()
    };

    const newCooldowns = [...cooldowns.filter(c => c.profileId !== profileId), newCooldown];
    setCooldowns(newCooldowns);
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(newCooldowns));
  };

  return {
    dailyMessagesRemaining: userTier === 'free'
      ? Math.max(0, DAILY_MESSAGE_LIMIT - messageCount.count)
      : 999,
    canMessageProfile,
    getCooldownTime,
    incrementMessage,
    hasDailyLimit: userTier === 'free' && messageCount.count >= DAILY_MESSAGE_LIMIT,
    hasProfileCooldown,
    getProfileMessagesRemaining
  };
}

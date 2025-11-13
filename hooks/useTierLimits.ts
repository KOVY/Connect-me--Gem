import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { UserTierLimits, UserDailyLimits, MessageSendResult } from '../types';

/**
 * Custom hook for managing user tier limits and daily usage
 * Implements 4-tier system: Anonymous, FREE, Premium, VIP
 */
export function useTierLimits(userId?: string) {
  const [tierLimits, setTierLimits] = useState<UserTierLimits | null>(null);
  const [dailyLimits, setDailyLimits] = useState<UserDailyLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      // Anonymous user - default limits
      setTierLimits({
        tier: 'anonymous',
        swipesLimit: 5,
        messagesLimit: 3,
        superLikesLimit: 0,
        boostsLimit: 0,
        canSendGifts: true, // Can send gifts to Reels/chat
        giftFeePercentage: 0, // Anonymous doesn't earn from gifts
        hasAds: false, // No ads for anonymous (not registered yet)
        canSeeWhoLiked: false,
      });
      setIsLoading(false);
      return;
    }

    // Fetch user's tier limits from database
    const fetchTierLimits = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_user_tier_limits', { p_user_id: userId });

        if (error) throw error;

        if (data && data.length > 0) {
          const limits = data[0];
          setTierLimits({
            tier: limits.tier,
            swipesLimit: limits.swipes_limit,
            messagesLimit: limits.messages_limit,
            superLikesLimit: limits.super_likes_limit,
            boostsLimit: limits.boosts_limit,
            canSendGifts: limits.can_send_gifts,
            giftFeePercentage: limits.gift_fee_percentage,
            hasAds: limits.has_ads,
            canSeeWhoLiked: limits.can_see_who_liked,
          });
        }
      } catch (error) {
        console.error('Error fetching tier limits:', error);
      }
    };

    // Fetch daily usage limits
    const fetchDailyLimits = async () => {
      try {
        const { data, error } = await supabase
          .from('user_daily_limits')
          .select('*')
          .eq('user_id', userId)
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error

        if (data) {
          setDailyLimits({
            id: data.id,
            userId: data.user_id,
            date: data.date,
            swipesToday: data.swipes_today,
            swipesLimit: data.swipes_limit,
            messagesToday: data.messages_today,
            messagesLimit: data.messages_limit,
            aiMessagesToday: data.ai_messages_today,
            realMessagesToday: data.real_messages_today,
            superLikesToday: data.super_likes_today,
            superLikesLimit: data.super_likes_limit,
            boostsThisMonth: data.boosts_this_month,
            boostsLimit: data.boosts_limit,
          });
        }
      } catch (error) {
        console.error('Error fetching daily limits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTierLimits();
    fetchDailyLimits();

    // Subscribe to changes
    const subscription = supabase
      .channel(`tier-limits-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`,
        },
        () => {
          fetchTierLimits();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_daily_limits',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchDailyLimits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  /**
   * Check if user can send a message to a specific profile
   */
  const canSendMessage = async (targetProfileId: string): Promise<MessageSendResult> => {
    if (!userId) {
      return {
        canSend: false,
        reason: 'daily_limit_reached',
        cooldownUntil: null,
        messagesRemaining: 0,
      };
    }

    try {
      const { data, error } = await supabase
        .rpc('can_send_message', {
          p_user_id: userId,
          p_target_profile_id: targetProfileId,
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        return {
          canSend: result.can_send,
          reason: result.reason,
          cooldownUntil: result.cooldown_until,
          messagesRemaining: result.messages_remaining,
        };
      }
    } catch (error) {
      console.error('Error checking message permission:', error);
    }

    return {
      canSend: false,
      reason: 'daily_limit_reached',
      cooldownUntil: null,
      messagesRemaining: 0,
    };
  };

  /**
   * Record that a message was sent (updates limits and cooldowns)
   */
  const recordMessageSent = async (targetProfileId: string, isAiProfile: boolean = false) => {
    if (!userId) return;

    try {
      await supabase.rpc('record_message_sent', {
        p_user_id: userId,
        p_target_profile_id: targetProfileId,
        p_is_ai_profile: isAiProfile,
      });

      // Refresh daily limits
      const { data } = await supabase
        .from('user_daily_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (data) {
        setDailyLimits({
          id: data.id,
          userId: data.user_id,
          date: data.date,
          swipesToday: data.swipes_today,
          swipesLimit: data.swipes_limit,
          messagesToday: data.messages_today,
          messagesLimit: data.messages_limit,
          aiMessagesToday: data.ai_messages_today,
          realMessagesToday: data.real_messages_today,
          superLikesToday: data.super_likes_today,
          superLikesLimit: data.super_likes_limit,
          boostsThisMonth: data.boosts_this_month,
          boostsLimit: data.boosts_limit,
        });
      }
    } catch (error) {
      console.error('Error recording message sent:', error);
    }
  };

  /**
   * Upgrade user to new tier
   */
  const upgradeTier = async (
    newTier: 'free' | 'premium' | 'vip',
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
    durationMonths: number = 1
  ) => {
    if (!userId) return;

    try {
      await supabase.rpc('upgrade_user_tier', {
        p_user_id: userId,
        p_new_tier: newTier,
        p_stripe_customer_id: stripeCustomerId,
        p_stripe_subscription_id: stripeSubscriptionId,
        p_duration_months: durationMonths,
      });

      // Refresh tier limits
      const { data } = await supabase
        .rpc('get_user_tier_limits', { p_user_id: userId });

      if (data && data.length > 0) {
        const limits = data[0];
        setTierLimits({
          tier: limits.tier,
          swipesLimit: limits.swipes_limit,
          messagesLimit: limits.messages_limit,
          superLikesLimit: limits.super_likes_limit,
          boostsLimit: limits.boosts_limit,
          canSendGifts: limits.can_send_gifts,
          giftFeePercentage: limits.gift_fee_percentage,
          hasAds: limits.has_ads,
          canSeeWhoLiked: limits.can_see_who_liked,
        });
      }
    } catch (error) {
      console.error('Error upgrading tier:', error);
    }
  };

  return {
    tierLimits,
    dailyLimits,
    isLoading,
    canSendMessage,
    recordMessageSent,
    upgradeTier,
  };
}

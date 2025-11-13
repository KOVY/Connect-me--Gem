import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface UserReelsAnalytics {
  totalReels: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  giftsReceived: number;
  totalGiftsValue: number;
}

/**
 * Real-time subscription hook for user's Reels analytics
 * Aggregates stats across all user's Reels
 * Updates in real-time as interactions happen
 */
export function useUserReelsAnalytics(userId?: string) {
  const [analytics, setAnalytics] = useState<UserReelsAnalytics>({
    totalReels: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    giftsReceived: 0,
    totalGiftsValue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    // Fetch initial analytics
    const fetchAnalytics = async () => {
      try {
        // Get all reels by this user
        const { data: reels, error } = await supabase
          .from('reels')
          .select('id, view_count, like_count, comment_count, gift_count, total_gifts_value')
          .eq('user_id', userId);

        if (error) throw error;

        if (reels && reels.length > 0) {
          const aggregated = reels.reduce(
            (acc, reel) => ({
              totalReels: acc.totalReels + 1,
              totalViews: acc.totalViews + (reel.view_count || 0),
              totalLikes: acc.totalLikes + (reel.like_count || 0),
              totalComments: acc.totalComments + (reel.comment_count || 0),
              giftsReceived: acc.giftsReceived + (reel.gift_count || 0),
              totalGiftsValue: acc.totalGiftsValue + (reel.total_gifts_value || 0),
            }),
            {
              totalReels: 0,
              totalViews: 0,
              totalLikes: 0,
              totalComments: 0,
              giftsReceived: 0,
              totalGiftsValue: 0,
            }
          );

          setAnalytics(aggregated);
        }
      } catch (error) {
        console.error('Error fetching user reels analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();

    // Subscribe to real-time updates on user's reels
    const reelsChannel = supabase
      .channel(`user-reels-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reels',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Re-fetch analytics when any reel changes
          fetchAnalytics();
        }
      )
      .subscribe();

    // Also subscribe to gifts sent to this user's reels
    const giftsChannel = supabase
      .channel(`user-gifts-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reel_gifts',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          // Re-fetch analytics when gifts are received
          fetchAnalytics();
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(reelsChannel);
      supabase.removeChannel(giftsChannel);
    };
  }, [userId]);

  return { analytics, isLoading };
}

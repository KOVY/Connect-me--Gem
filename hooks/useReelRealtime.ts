import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface ReelRealtimeStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  giftCount: number;
  totalGiftsValue: number;
  isLiked?: boolean;
}

/**
 * Real-time subscription hook for Reel statistics
 * Subscribes to changes in reel_views, reel_likes, reel_comments, reel_gifts
 * Updates counters in real-time as other users interact
 */
export function useReelRealtime(reelId: string, userId?: string) {
  const [stats, setStats] = useState<ReelRealtimeStats>({
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    giftCount: 0,
    totalGiftsValue: 0,
    isLiked: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!reelId) return;

    // Fetch initial stats
    const fetchInitialStats = async () => {
      try {
        const { data: reel, error } = await supabase
          .from('reels')
          .select('view_count, like_count, comment_count, gift_count, total_gifts_value')
          .eq('id', reelId)
          .single();

        if (error) throw error;

        // Check if current user has liked this reel
        let isLiked = false;
        if (userId) {
          const { data: likeData } = await supabase
            .from('reel_likes')
            .select('id')
            .eq('reel_id', reelId)
            .eq('user_id', userId)
            .single();

          isLiked = !!likeData;
        }

        setStats({
          viewCount: reel?.view_count || 0,
          likeCount: reel?.like_count || 0,
          commentCount: reel?.comment_count || 0,
          giftCount: reel?.gift_count || 0,
          totalGiftsValue: reel?.total_gifts_value || 0,
          isLiked,
        });
      } catch (error) {
        console.error('Error fetching reel stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialStats();

    // Subscribe to real-time updates on the reels table
    const reelsChannel = supabase
      .channel(`reel-${reelId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reels',
          filter: `id=eq.${reelId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setStats((prev) => ({
            ...prev,
            viewCount: newData.view_count || prev.viewCount,
            likeCount: newData.like_count || prev.likeCount,
            commentCount: newData.comment_count || prev.commentCount,
            giftCount: newData.gift_count || prev.giftCount,
            totalGiftsValue: newData.total_gifts_value || prev.totalGiftsValue,
          }));
        }
      )
      .subscribe();

    // Subscribe to reel_likes for this reel (to update like count in real-time)
    const likesChannel = supabase
      .channel(`reel-likes-${reelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reel_likes',
          filter: `reel_id=eq.${reelId}`,
        },
        async (payload) => {
          // Re-fetch the updated stats after a like/unlike
          const { data: reel } = await supabase
            .from('reels')
            .select('like_count')
            .eq('id', reelId)
            .single();

          if (reel) {
            setStats((prev) => ({
              ...prev,
              likeCount: reel.like_count || prev.likeCount,
            }));
          }

          // Update isLiked status if it's the current user
          if (userId && payload.new && (payload.new as any).user_id === userId) {
            setStats((prev) => ({
              ...prev,
              isLiked: payload.eventType === 'INSERT',
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to reel_comments for this reel
    const commentsChannel = supabase
      .channel(`reel-comments-${reelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reel_comments',
          filter: `reel_id=eq.${reelId}`,
        },
        async () => {
          // Re-fetch comment count
          const { data: reel } = await supabase
            .from('reels')
            .select('comment_count')
            .eq('id', reelId)
            .single();

          if (reel) {
            setStats((prev) => ({
              ...prev,
              commentCount: reel.comment_count || prev.commentCount,
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to reel_gifts for this reel
    const giftsChannel = supabase
      .channel(`reel-gifts-${reelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reel_gifts',
          filter: `reel_id=eq.${reelId}`,
        },
        async () => {
          // Re-fetch gift stats
          const { data: reel } = await supabase
            .from('reels')
            .select('gift_count, total_gifts_value')
            .eq('id', reelId)
            .single();

          if (reel) {
            setStats((prev) => ({
              ...prev,
              giftCount: reel.gift_count || prev.giftCount,
              totalGiftsValue: reel.total_gifts_value || prev.totalGiftsValue,
            }));
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(reelsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(giftsChannel);
    };
  }, [reelId, userId]);

  return { stats, isLoading };
}

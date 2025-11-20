import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Gift as GiftIcon, Heart, MoreVertical } from 'lucide-react';
import { ReelComment, UserProfile } from '../types';
import { AVAILABLE_GIFTS } from '../src/lib/gifts';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';
import { useNotifications } from '../contexts/NotificationContext';
import { useCommentTracker } from '../hooks/useCommentTracker';
import { supabase } from '../src/lib/supabase';
import TierUpgradeModal from './TierUpgradeModal';

interface ReelCommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  reelOwner: UserProfile;
  commentCount: number;
}

export function ReelCommentsPanel({
  isOpen,
  onClose,
  reelId,
  reelOwner,
  commentCount
}: ReelCommentsPanelProps) {
  const { user, getUserTier } = useUser();
  const { t } = useTranslations();
  const { showGiftNotification } = useNotifications();
  const userTier = getUserTier();
  const commentTracker = useCommentTracker(userTier, !!user);

  const [comments, setComments] = useState<ReelComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [selectedGift, setSelectedGift] = useState<typeof AVAILABLE_GIFTS[0] | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReelComment | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load comments from Supabase
  useEffect(() => {
    if (!isOpen) return;

    const loadComments = async () => {
      setIsLoading(true);
      try {
        // Fetch comments with user profile information
        const { data: commentsData, error } = await supabase
          .from('reel_comments')
          .select(`
            id,
            reel_id,
            user_id,
            comment_text,
            parent_comment_id,
            includes_gift,
            gift_id,
            gift_value_credits,
            like_count,
            reply_count,
            is_flagged,
            is_deleted,
            created_at,
            updated_at
          `)
          .eq('reel_id', reelId)
          .eq('is_deleted', false)
          .is('parent_comment_id', null) // Only top-level comments for now
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (commentsData && commentsData.length > 0) {
          // Fetch user profiles for all commenters
          const userIds = [...new Set(commentsData.map(c => c.user_id))];
          const { data: profilesData } = await supabase
            .from('discovery_profiles')
            .select('id, user_id, name, age, photo_url, occupation, verified, country')
            .in('user_id', userIds);

          // Create a map of user_id to profile
          const profileMap = new Map(
            profilesData?.map(p => [p.user_id, p]) || []
          );

          // Map comments to ReelComment type
          const mappedComments: ReelComment[] = commentsData.map(comment => {
            const profile = profileMap.get(comment.user_id);
            const gift = comment.includes_gift && comment.gift_id
              ? AVAILABLE_GIFTS.find(g => g.id === comment.gift_id)
              : null;

            return {
              id: comment.id,
              reelId: comment.reel_id,
              userId: comment.user_id,
              user: {
                id: profile?.id || comment.user_id,
                name: profile?.name || 'Anonymous',
                age: profile?.age || 0,
                imageUrl: profile?.photo_url || 'https://via.placeholder.com/100',
                occupation: profile?.occupation || 'User',
                bio: '',
                interests: [],
                hobbies: [],
                country: profile?.country || 'Unknown',
                lastSeen: new Date().toISOString(),
                verified: profile?.verified || false,
                icebreakers: []
              },
              commentText: comment.comment_text,
              parentCommentId: comment.parent_comment_id,
              includesGift: comment.includes_gift,
              giftId: comment.gift_id,
              giftIcon: gift?.icon,
              giftName: gift?.name,
              giftValueCredits: comment.gift_value_credits,
              likeCount: comment.like_count,
              replyCount: comment.reply_count,
              isFlagged: comment.is_flagged,
              isDeleted: comment.is_deleted,
              createdAt: comment.created_at,
              updatedAt: comment.updated_at,
            };
          });

          setComments(mappedComments);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();

    // Subscribe to new comments in real-time
    const subscription = supabase
      .channel(`reel-comments-${reelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reel_comments',
          filter: `reel_id=eq.${reelId}`
        },
        () => {
          // Reload comments when new one is added
          loadComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen, reelId]);

  const handleSendComment = async () => {
    if (!newComment.trim() && !selectedGift) return;
    if (!user) {
      console.error('User must be logged in to comment');
      return;
    }

    // Check if FREE user has reached comment limit
    if (userTier === 'free' && !commentTracker.canComment) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Insert comment into Supabase
      const { data, error } = await supabase
        .from('reel_comments')
        .insert({
          reel_id: reelId,
          user_id: user.id,
          comment_text: newComment.trim() || '',
          parent_comment_id: replyingTo?.id || null, // Support replies
          includes_gift: !!selectedGift,
          gift_id: selectedGift?.id || null,
          gift_value_credits: selectedGift?.creditCost || 0,
        })
        .select()
        .single();

      if (error) throw error;

      // If gift was included, also record it in reel_gifts table
      if (selectedGift && data) {
        await supabase.from('reel_gifts').insert({
          reel_id: reelId,
          sender_id: user.id,
          recipient_id: reelOwner.id,
          gift_id: selectedGift.id,
          gift_name: selectedGift.name,
          gift_icon: selectedGift.icon,
          credit_cost: selectedGift.creditCost,
          comment_id: data.id,
        });

        // Show gift notification
        showGiftNotification(selectedGift.name, user.name, selectedGift.icon);

        // Deduct credits from user (you may want to do this in a Supabase function)
        // For now, we'll handle it client-side
        // TODO: Move credit deduction to secure backend function
      }

      // Track comment for FREE users
      if (userTier === 'free') {
        commentTracker.incrementComment();
      }

      // Clear input
      setNewComment('');
      setSelectedGift(null);
      setShowGiftPicker(false);
      setReplyingTo(null);

      // Comments will auto-refresh via real-time subscription
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('Failed to send comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyClick = (comment: ReelComment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 to-black rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">
              {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
            </h2>
            <p className="text-sm text-gray-400">@{reelOwner.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* FREE User Comment Limit Banner */}
        {userTier === 'free' && (
          <div className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {commentTracker.freeCommentsRemaining > 0 ? (
                    <>
                      💬 {commentTracker.freeCommentsRemaining} free {commentTracker.freeCommentsRemaining === 1 ? 'comment' : 'comments'} remaining
                    </>
                  ) : (
                    <>
                      🔒 No free comments left
                    </>
                  )}
                </p>
                <p className="text-xs text-purple-200 mt-0.5">
                  {commentTracker.freeCommentsRemaining > 0 ? (
                    'Upgrade for unlimited comments'
                  ) : (
                    'Upgrade to Premium to keep commenting'
                  )}
                </p>
              </div>
              {commentTracker.freeCommentsRemaining === 0 && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="ml-3 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold text-white hover:scale-105 transition-transform"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No comments yet</p>
              <p className="text-sm text-gray-500 mt-2">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <img
                  src={comment.user.imageUrl}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{comment.user.name}</span>
                    {comment.user.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    )}
                    <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                  </div>

                  {/* Gift Badge */}
                  {comment.includesGift && (
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                      <span className="text-2xl">{comment.giftIcon}</span>
                      <span className="text-sm font-medium text-purple-200">sent {comment.giftName}</span>
                      <span className="text-xs text-purple-300">{comment.giftValueCredits} credits</span>
                    </div>
                  )}

                  {/* Comment Text */}
                  {comment.commentText && (
                    <p className="text-white text-sm mb-2">{comment.commentText}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 text-xs">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                    </button>
                    <button
                      onClick={() => handleReplyClick(comment)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Reply
                    </button>
                    {comment.replyCount > 0 && (
                      <button className="text-gray-400 hover:text-white transition-colors">
                        View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                  </div>
                </div>

                {/* More Options */}
                <button className="p-1 hover:bg-white/10 rounded-full flex-shrink-0">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Gift Picker (if opened) */}
        {showGiftPicker && (
          <div className="border-t border-white/10 p-4 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Send a gift with your comment</h3>
              <button
                onClick={() => setShowGiftPicker(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {AVAILABLE_GIFTS.slice(0, 8).map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => {
                    setSelectedGift(gift);
                    setShowGiftPicker(false);
                    inputRef.current?.focus();
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedGift?.id === gift.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{gift.icon}</span>
                  <span className="text-xs text-white font-medium">{gift.creditCost}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 bg-gray-900">
          {/* Replying To Indicator */}
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="flex-1">
                <p className="text-xs text-blue-300">Replying to</p>
                <p className="text-sm font-medium text-white">@{replyingTo.user.name}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Selected Gift Indicator */}
          {selectedGift && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <span className="text-2xl">{selectedGift.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{selectedGift.name}</p>
                <p className="text-xs text-purple-300">{selectedGift.creditCost} credits</p>
              </div>
              <button
                onClick={() => setSelectedGift(null)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGiftPicker(!showGiftPicker)}
              className={`p-2 rounded-full transition-colors ${
                showGiftPicker
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <GiftIcon className="w-5 h-5 text-white" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder={
                replyingTo
                  ? `Reply to @${replyingTo.user.name}...`
                  : selectedGift
                  ? `Send ${selectedGift.name} with a message...`
                  : 'Add a comment...'
              }
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
            />

            <button
              onClick={handleSendComment}
              disabled={!newComment.trim() && !selectedGift}
              className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            {selectedGift
              ? `💡 Gifts help creators earn. They'll receive $${(selectedGift.creditCost / 100 * 0.4).toFixed(2)}`
              : '💡 Send a gift to support the creator'
            }
          </p>
        </div>
      </div>

      {/* Upgrade Modal */}
      <TierUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={async (tier) => {
          console.log('Upgrading to:', tier);
          // TODO: Implement actual upgrade flow with Stripe
          setShowUpgradeModal(false);
        }}
      />
    </>
  );
}

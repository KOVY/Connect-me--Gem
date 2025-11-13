import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Gift as GiftIcon, Heart, MoreVertical } from 'lucide-react';
import { ReelComment, UserProfile } from '../types';
import { AVAILABLE_GIFTS } from '../src/lib/gifts';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';

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
  const { user } = useUser();
  const { t } = useTranslations();
  const [comments, setComments] = useState<ReelComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [selectedGift, setSelectedGift] = useState<typeof AVAILABLE_GIFTS[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock comments for demo
  useEffect(() => {
    if (isOpen) {
      // TODO: Load real comments from Supabase
      const mockComments: ReelComment[] = [
        {
          id: '1',
          reelId,
          userId: '123',
          user: {
            id: '123',
            name: 'Sarah Johnson',
            age: 25,
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            occupation: 'Photographer',
            bio: '',
            interests: [],
            hobbies: [],
            country: 'US',
            lastSeen: new Date().toISOString(),
            verified: true,
            icebreakers: []
          },
          commentText: 'Amazing video! 🔥',
          includesGift: false,
          likeCount: 12,
          replyCount: 2,
          isFlagged: false,
          isDeleted: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          reelId,
          userId: '456',
          user: {
            id: '456',
            name: 'Mike Chen',
            age: 28,
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            occupation: 'Developer',
            bio: '',
            interests: [],
            hobbies: [],
            country: 'US',
            lastSeen: new Date().toISOString(),
            verified: false,
            icebreakers: []
          },
          commentText: '',
          includesGift: true,
          giftId: 'rose',
          giftIcon: '🌹',
          giftName: 'Rose',
          giftValueCredits: 10,
          likeCount: 5,
          replyCount: 0,
          isFlagged: false,
          isDeleted: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString(),
        }
      ];
      setComments(mockComments);
    }
  }, [isOpen, reelId]);

  const handleSendComment = () => {
    if (!newComment.trim() && !selectedGift) return;

    // TODO: Send comment to Supabase
    const newCommentObj: ReelComment = {
      id: Math.random().toString(),
      reelId,
      userId: user?.id || 'current-user',
      user: {
        id: user?.id || 'current-user',
        name: 'You',
        age: 25,
        imageUrl: user?.profilePictureUrl || 'https://via.placeholder.com/100',
        occupation: 'User',
        bio: '',
        interests: [],
        hobbies: [],
        country: 'US',
        lastSeen: new Date().toISOString(),
        verified: false,
        icebreakers: []
      },
      commentText: newComment,
      includesGift: !!selectedGift,
      giftId: selectedGift?.id,
      giftIcon: selectedGift?.icon,
      giftName: selectedGift?.name,
      giftValueCredits: selectedGift?.creditCost,
      likeCount: 0,
      replyCount: 0,
      isFlagged: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setSelectedGift(null);
    setShowGiftPicker(false);
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
                    <button className="text-gray-400 hover:text-white transition-colors">
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
              placeholder={selectedGift ? `Send ${selectedGift.name} with a message...` : 'Add a comment...'}
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
    </>
  );
}

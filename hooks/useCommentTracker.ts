import { useState, useEffect } from 'react';

const COMMENT_LIMIT_KEY = 'aura_comment_limit';
const FREE_COMMENT_LIMIT = 5;

interface CommentCount {
  count: number;
  lastReset: string;
}

export interface CommentTrackerState {
  freeCommentsRemaining: number;
  canComment: boolean;
  incrementComment: () => void;
  hasReachedLimit: boolean;
}

/**
 * Hook for tracking comment limits for FREE users
 *
 * Rules:
 * - FREE users: 5 comments total (forever or until they upgrade)
 * - PREMIUM/VIP users: Unlimited comments
 * - Comments require credits after free limit is reached
 */
export function useCommentTracker(
  userTier: 'free' | 'premium' | 'vip',
  isAuthenticated: boolean
): CommentTrackerState {
  const [commentCount, setCommentCount] = useState<CommentCount>({
    count: 0,
    lastReset: new Date().toISOString(),
  });

  // Load from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated || userTier !== 'free') {
      return;
    }

    const savedCount = localStorage.getItem(COMMENT_LIMIT_KEY);

    if (savedCount) {
      const parsed: CommentCount = JSON.parse(savedCount);
      setCommentCount(parsed);
    }
  }, [isAuthenticated, userTier]);

  const canComment = (): boolean => {
    // Premium and VIP have unlimited comments
    if (userTier !== 'free') {
      return true;
    }

    // Check if free limit reached
    return commentCount.count < FREE_COMMENT_LIMIT;
  };

  const incrementComment = () => {
    if (userTier !== 'free' || !isAuthenticated) {
      return;
    }

    const newCount: CommentCount = {
      count: commentCount.count + 1,
      lastReset: commentCount.lastReset,
    };

    setCommentCount(newCount);
    localStorage.setItem(COMMENT_LIMIT_KEY, JSON.stringify(newCount));
  };

  const freeCommentsRemaining = userTier === 'free'
    ? Math.max(0, FREE_COMMENT_LIMIT - commentCount.count)
    : 999;

  return {
    freeCommentsRemaining,
    canComment: canComment(),
    incrementComment,
    hasReachedLimit: userTier === 'free' && commentCount.count >= FREE_COMMENT_LIMIT,
  };
}

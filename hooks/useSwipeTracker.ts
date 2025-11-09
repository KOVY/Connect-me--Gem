import { useState, useEffect } from 'react';

const SWIPE_LIMIT_KEY = 'aura_swipe_count';
const SWIPE_LIMIT = 5;

export interface SwipeTrackerState {
  swipeCount: number;
  hasReachedLimit: boolean;
  canSwipe: boolean;
  incrementSwipe: () => void;
  resetSwipes: () => void;
}

/**
 * Hook pro sledování počtu swipes před registrací
 * Po 5 swipes uživatel musí se registrovat
 */
export function useSwipeTracker(isAuthenticated: boolean): SwipeTrackerState {
  const [swipeCount, setSwipeCount] = useState(0);

  // Načtení počtu swipes z LocalStorage při startu
  useEffect(() => {
    if (!isAuthenticated) {
      const savedCount = localStorage.getItem(SWIPE_LIMIT_KEY);
      setSwipeCount(savedCount ? parseInt(savedCount, 10) : 0);
    } else {
      // Pokud je uživatel přihlášený, resetujeme počítadlo
      localStorage.removeItem(SWIPE_LIMIT_KEY);
      setSwipeCount(0);
    }
  }, [isAuthenticated]);

  const incrementSwipe = () => {
    if (!isAuthenticated) {
      const newCount = swipeCount + 1;
      setSwipeCount(newCount);
      localStorage.setItem(SWIPE_LIMIT_KEY, newCount.toString());
    }
  };

  const resetSwipes = () => {
    setSwipeCount(0);
    localStorage.removeItem(SWIPE_LIMIT_KEY);
  };

  const hasReachedLimit = !isAuthenticated && swipeCount >= SWIPE_LIMIT;
  const canSwipe = isAuthenticated || swipeCount < SWIPE_LIMIT;

  return {
    swipeCount,
    hasReachedLimit,
    canSwipe,
    incrementSwipe,
    resetSwipes,
  };
}

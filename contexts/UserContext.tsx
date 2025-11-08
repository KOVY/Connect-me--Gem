import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Transaction, Gift } from '../types';
import * as api from '../api';
import { calculateProfileCompleteness, getProfileCompletionSuggestions } from '../utils/profile';

interface UserContextState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  transactions: Transaction[];
  updateUser: (updates: Partial<Pick<User, 'name' | 'bio' | 'interests' | 'profilePictureUrl' | 'occupation'>>) => Promise<void>;
  sendGift: (gift: Gift, recipientName: string) => Promise<void>;
  purchaseCredits: (packageId: string) => Promise<void>;
  subscribe: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  useBoost: () => Promise<void>;
  useSuperLike: (profileId: string) => Promise<void>;
  useRewind: () => Promise<void>;
  profileCompleteness: number;
  completionSuggestions: string[];
}

const UserContext = createContext<UserContextState | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.fetchUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const updateUser = useCallback(async (updates: Partial<Pick<User, 'name' | 'bio' | 'interests' | 'profilePictureUrl' | 'occupation'>>) => {
    const updatedUser = await api.updateUserProfile(updates);
    setUser(updatedUser);
  }, []);

  const sendGift = useCallback(async (gift: Gift, recipientName: string) => {
    if (!user || user.credits < gift.cost) {
      throw new Error("Insufficient credits");
    }
    const { user: updatedUser } = await api.processGiftPurchase(gift, recipientName);
    setUser(updatedUser);
  }, [user]);

  const purchaseCredits = useCallback(async (packageId: string) => {
      const { user: updatedUser } = await api.processCreditPurchase(packageId);
      setUser(updatedUser);
  }, []);

  const subscribe = useCallback(async (planId: string) => {
    const { user: updatedUser } = await api.processSubscription(planId);
    setUser(updatedUser);
  }, []);

  const cancelSubscription = useCallback(async () => {
    const updatedUser = await api.cancelSubscription();
    setUser(updatedUser);
  }, []);

  const useBoost = useCallback(async () => {
    const updatedUser = await api.useBoost();
    setUser(updatedUser);
  }, []);

  const useSuperLike = useCallback(async (profileId: string) => {
    const updatedUser = await api.useSuperLike(profileId);
    setUser(updatedUser);
  }, []);

  const useRewind = useCallback(async () => {
    const updatedUser = await api.useRewind();
    setUser(updatedUser);
  }, []);

  const profileCompleteness = useMemo(() => calculateProfileCompleteness(user), [user]);
  const completionSuggestions = useMemo(() => getProfileCompletionSuggestions(user), [user]);


  const value: UserContextState = {
    user,
    isLoading,
    isLoggedIn: !!user,
    transactions: user?.transactions ?? [],
    updateUser,
    sendGift,
    purchaseCredits,
    subscribe,
    cancelSubscription,
    useBoost,
    useSuperLike,
    useRewind,
    profileCompleteness,
    completionSuggestions,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextState => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
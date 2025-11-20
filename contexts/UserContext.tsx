import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Transaction, Gift } from '../types';
import * as api from '../api';
import { calculateProfileCompleteness, getProfileCompletionSuggestions } from '../utils/profile';
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../src/lib/supabase';

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
  signOut: () => Promise<void>;
  profileCompleteness: number;
  completionSuggestions: string[];
  getUserTier: () => 'free' | 'premium' | 'vip';
}

const UserContext = createContext<UserContextState | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from Supabase
  const fetchUserFromSupabase = useCallback(async () => {
    try {
      // Get authenticated user
      const authUser = await getCurrentUser();

      if (!authUser) {
        console.log('No authenticated user found');
        setUser(null);
        return null;
      }

      console.log('Authenticated user:', authUser.id);

      // Fetch user profile from discovery_profiles
      const { data: profile, error: profileError } = await supabase
        .from('discovery_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If no profile exists yet, return basic user data
        const basicUser: User = {
          id: authUser.id,
          name: authUser.email?.split('@')[0] || 'User',
          bio: '',
          occupation: '',
          interests: [],
          credits: 0,
          transactions: [],
          profilePictureUrl: '',
          imageUrl: '',
          avatarUrl: '', // Normalized avatar URL
        };
        setUser(basicUser);
        return basicUser;
      }

      // Fetch user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      // Fetch user achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', authUser.id);

      // Fetch user credits (from user_credits table if exists, or default to 0)
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', authUser.id)
        .single();

      // Fetch transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .single();

      // Build User object
      const imageUrl = profile?.image_url || '';
      const userData: User = {
        id: authUser.id,
        name: profile?.name || authUser.email?.split('@')[0] || 'User',
        bio: profile?.bio || '',
        occupation: profile?.occupation || '',
        interests: profile?.interests || [],
        credits: creditsData?.balance || 0,
        transactions: transactions?.map((t: any) => ({
          id: t.id,
          date: new Date(t.created_at).toISOString().split('T')[0],
          description: t.description || t.type,
          amount: t.amount || 0,
        })) || [],
        profilePictureUrl: imageUrl,
        imageUrl: imageUrl,
        avatarUrl: imageUrl, // Normalized avatar URL
        verified: profile?.verified || false,
        subscription: subscription ? {
          tier: subscription.tier,
          startDate: subscription.start_date,
          expiryDate: subscription.end_date,
          autoRenew: subscription.auto_renew || false,
        } : undefined,
        superLikesRemaining: 0, // TODO: Fetch from user_limits table
        boostsRemaining: 0,
        rewindsRemaining: 0,
        stats: stats ? {
          totalLikes: stats.total_likes || 0,
          totalMatches: stats.total_matches || 0,
          totalMessages: stats.total_messages || 0,
          profileViews: stats.profile_views || 0,
          points: stats.points || 0,
          level: stats.level || 1,
          achievements: achievements?.map((a: any) => ({
            id: a.achievement_id,
            name: a.achievements.name,
            description: a.achievements.description,
            icon: a.achievements.icon,
            category: a.achievements.category,
            unlockedAt: a.unlocked_at,
            progress: a.progress,
            target: a.achievements.target,
          })) || [],
          dailyStreak: {
            current: stats.daily_streak_current || 0,
            longest: stats.daily_streak_longest || 0,
            lastActivityDate: stats.daily_streak_last_activity || new Date().toISOString(),
            isActive: true,
          },
          messageStreak: {
            current: stats.message_streak_current || 0,
            longest: stats.message_streak_longest || 0,
            lastActivityDate: stats.message_streak_last_activity || new Date().toISOString(),
            isActive: true,
          },
        } : undefined,
      };

      console.log('Loaded user from Supabase:', userData);
      setUser(userData);
      return userData;

    } catch (error) {
      console.error('Error fetching user from Supabase:', error);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to load from Supabase first
        await fetchUserFromSupabase();
      } catch (error) {
        console.error("Failed to load user data from Supabase, falling back to mock", error);
        // Fallback to mock API
        try {
          const userData = await api.fetchUserData();
          setUser(userData);
        } catch (fallbackError) {
          console.error("Failed to load mock user data", fallbackError);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUserFromSupabase();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserFromSupabase]);

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

  const getUserTier = useCallback((): 'free' | 'premium' | 'vip' => {
    if (!user || !user.subscription) {
      return 'free';
    }

    const subscription = user.subscription;
    const isActive = new Date(subscription.expiryDate) > new Date();

    if (!isActive) {
      return 'free';
    }

    // Check tier (case-insensitive)
    const tier = subscription.tier?.toLowerCase();
    if (tier === 'vip') {
      return 'vip';
    }
    if (tier === 'premium') {
      return 'premium';
    }

    return 'free';
  }, [user]);

  const signOut = useCallback(async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

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
    signOut,
    profileCompleteness,
    completionSuggestions,
    getUserTier,
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
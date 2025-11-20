// --- Core Data Types ---

export interface UserProfile {
    id: string;
    name: string;
    age: number;
    imageUrl: string;
    occupation: string;
    bio: string;
    interests: string[];
    hobbies: string[];
    country: string;
    lastSeen: string; // ISO string date
    verified?: boolean; // Verification badge (for VIP users)
    icebreakers?: string[]; // Conversation prompts (max 3)
}

export interface User extends Omit<UserProfile, 'age' | 'country' | 'lastSeen' | 'hobbies'> {
    credits: number;
    transactions: Transaction[];
    profilePictureUrl: string; // Renamed from imageUrl for clarity
    avatarUrl: string; // Normalized avatar URL (prioritizes profilePictureUrl, falls back to imageUrl)
    subscription?: UserSubscription; // Current subscription
    superLikesRemaining?: number; // Super likes available
    boostsRemaining?: number; // Profile boosts available
    rewindsRemaining?: number; // Rewinds available
    likedBy?: ProfileLike[]; // Who liked this user
    likedProfiles?: ProfileLike[]; // Who this user liked
    stats?: UserStats; // Gamification stats, streaks, and achievements
}

export interface ProfileLike {
    profileId: string;
    profile: UserProfile;
    timestamp: string; // ISO string date
    isSuperLike: boolean;
    isMatch?: boolean; // Mutual like
}

export interface UserSubscription {
    tier: SubscriptionTier;
    startDate: string; // ISO string date
    expiryDate: string; // ISO string date
    autoRenew: boolean;
}

export type SubscriptionTier = 'anonymous' | 'free' | 'premium' | 'vip';

export interface SubscriptionPlan {
    id: string;
    tier: SubscriptionTier;
    name: string;
    price: number;
    currency: SupportedCurrency;
    duration: 'monthly' | 'yearly';
    features: string[];
    savings?: string; // e.g., "Save 20%" for yearly plans
}

export interface ChatMessage {
    id:string;
    sender: 'user' | 'ai' | 'system';
    type: 'text' | 'gift';
    text?: string;
    timestamp: string; // ISO string date
    reactions?: Record<string, string[]>; // emoji -> userIds[]
    gift?: Gift;
    read?: boolean; // Whether the message has been read (for read receipts)
}

export interface Gift {
    id: string;
    name: string;
    icon: string;
    cost: number;
}

export interface Transaction {
    id: string;
    date: string; // YYYY-MM-DD
    description: string;
    amount: number; // positive for credit, negative for debit
}

export interface CreditPackage {
    id: string;
    credits: number;
    price: number;
    currency: SupportedCurrency;
}

export interface Reel {
    id: string;
    videoUrl: string;
    description: string;
    userProfile: UserProfile;
    // Statistics
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    giftCount?: number;
    totalGiftsValue?: number; // In credits
    // Trending
    trendingScore?: number;
    trendingScore24h?: number;
    trendingScore7d?: number;
    // User interaction state
    isLiked?: boolean; // Whether current user liked this
    createdAt?: string;
}

// Reel Statistics
export interface ReelStats {
    reelId: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    giftCount: number;
    totalGiftsValueCredits: number;
    totalGiftsValueUsd: number;
    trendingScore: number;
    trendingScore24h: number;
    trendingScore7d: number;
}

// Reel View
export interface ReelView {
    id: string;
    reelId: string;
    viewerId: string | null;
    watchDurationSeconds: number;
    completed: boolean;
    viewedAt: string;
}

// Reel Like
export interface ReelLike {
    id: string;
    reelId: string;
    userId: string;
    user?: UserProfile;
    createdAt: string;
}

// Reel Comment
export interface ReelComment {
    id: string;
    reelId: string;
    userId: string;
    user: UserProfile;
    commentText: string;
    parentCommentId?: string | null;
    // Gift integration
    includesGift: boolean;
    giftId?: string | null;
    giftIcon?: string | null;
    giftName?: string | null;
    giftValueCredits?: number;
    // Engagement
    likeCount: number;
    replyCount: number;
    replies?: ReelComment[]; // Nested replies
    // State
    isFlagged: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// Reel Gift
export interface ReelGift {
    id: string;
    reelId: string;
    senderId: string;
    sender: UserProfile;
    recipientId: string;
    recipient: UserProfile;
    giftId: string;
    giftName: string;
    giftIcon: string;
    creditCost: number;
    commentId?: string | null;
    createdAt: string;
}


// --- Locale & Internationalization ---

export type SupportedLanguage = 'en' | 'cs' | 'de' | 'fr' | 'es' | 'it' | 'pl' | 'pt';
export type SupportedCountry = 'US' | 'GB' | 'DE' | 'FR' | 'ES' | 'IT' | 'CZ' | 'PL' | 'PT' | 'AT' | 'CH' | 'BE' | 'NL';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CZK' | 'PLN' | 'CHF';

export interface LocaleContextState {
    locale: string;
    language: SupportedLanguage;
    country: SupportedCountry;
    currency: SupportedCurrency;
}

// --- Discovery Filters ---

export interface DiscoveryFilters {
    ageRange: [number, number]; // [min, max]
    distance?: number; // in km
    gender?: 'male' | 'female' | 'other' | 'all';
    interests?: string[];
    verified?: boolean; // Only verified profiles
    hasPhotos?: boolean;
    height?: [number, number]; // in cm
    education?: EducationLevel[];
    smoking?: SmokingPreference[];
    drinking?: DrinkingPreference[];
    pets?: PetPreference[];
    professionalCategories?: ProfessionalCategory[]; // Profesní kategorie (terapeut, kouč, atd.)
}

export type EducationLevel = 'high_school' | 'bachelors' | 'masters' | 'phd';
export type SmokingPreference = 'never' | 'sometimes' | 'regularly';
export type DrinkingPreference = 'never' | 'socially' | 'regularly';
export type PetPreference = 'no_pets' | 'has_cats' | 'has_dogs' | 'has_other';
export type ProfessionalCategory =
    | 'therapist'           // Terapeut
    | 'couples_therapist'   // Párový terapeut
    | 'psychologist'        // Psycholog
    | 'couples_psychologist' // Párový psycholog
    | 'coach'               // Kouč / Coach
    | 'life_coach'          // Životní kouč
    | 'fitness_coach'       // Fitness trenér
    | 'business_coach'      // Byznys kouč
    | 'sports_coach'        // Sportovní trenér
    | 'nutritionist'        // Nutriční poradce
    | 'counselor'           // Poradce
    | 'psychiatrist'        // Psychiatr
    | 'social_worker';      // Sociální pracovník

// --- Gamification & Streaks ---

export interface UserStreak {
    current: number; // Current streak count in days
    longest: number; // Longest streak ever achieved
    lastActivityDate: string; // ISO date string
    isActive: boolean; // Whether streak is still active today
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'social' | 'engagement' | 'streak' | 'special';
    unlockedAt?: string; // ISO date string when unlocked
    progress?: number; // Progress towards unlocking (0-100)
    target?: number; // Target value to unlock
}

export interface UserStats {
    totalLikes: number;
    totalMatches: number;
    totalMessages: number;
    profileViews: number;
    points: number; // Gamification points
    level: number; // User level based on points
    achievements: Achievement[];
    dailyStreak: UserStreak;
    messageStreak: UserStreak;
}

// --- Stories/Moments (24h ephemeral content) ---

export interface StoryItem {
    id: string;
    userId: string;
    mediaUrl: string; // Image or video URL
    mediaType: 'image' | 'video';
    caption?: string;
    timestamp: string; // ISO date string
    expiresAt: string; // ISO date string (24h from timestamp)
    views: string[]; // User IDs who viewed this story
    reactions: StoryReaction[];
}

export interface StoryReaction {
    userId: string;
    emoji: string;
    timestamp: string;
}

export interface UserStories {
    user: UserProfile;
    stories: StoryItem[];
    hasUnviewedStories: boolean;
    lastUpdated: string; // ISO date of most recent story
}

// --- User Tiers & Monetization System ---

export interface UserTierLimits {
  tier: SubscriptionTier;
  swipesLimit: number;
  messagesLimit: number;
  superLikesLimit: number;
  boostsLimit: number;
  canSendGifts: boolean;
  giftFeePercentage: number; // Platform fee (60%, 50%, 30%)
  hasAds: boolean;
  canSeeWhoLiked: boolean;
}

export interface UserDailyLimits {
  id: string;
  userId: string;
  date: string; // ISO date
  swipesToday: number;
  swipesLimit: number;
  messagesToday: number;
  messagesLimit: number;
  aiMessagesToday: number; // Secret tracking
  realMessagesToday: number; // Secret tracking
  superLikesToday: number;
  superLikesLimit: number;
  boostsThisMonth: number;
  boostsLimit: number;
}

export interface MessageCooldown {
  id: string;
  userId: string;
  targetProfileId: string;
  messagesSentToday: number;
  messagesLimitPerProfile: number; // 2-3 for FREE
  lastMessageSentAt: string; // ISO date
  cooldownUntil: string | null; // 3h cooldown
  cooldown24hUntil: string | null; // 24h cooldown after limit
  unlockedUntil: string | null; // Unlocked with gift
  unlockType: 'coffee' | 'rose' | 'diamond' | null; // Gift type used to unlock
}

export interface MessageSendResult {
  canSend: boolean;
  reason: 'ok' | 'daily_limit_reached' | 'profile_cooldown_3h' | 'profile_cooldown_24h' | 'profile_daily_limit' | 'unlimited' | 'unlocked_with_gift';
  cooldownUntil: string | null;
  messagesRemaining: number;
}

export interface SubscriptionHistory {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'trial';
  startedAt: string; // ISO date
  endedAt: string | null; // ISO date
  stripeSubscriptionId: string | null;
  amountPaid: number;
  currency: string;
}

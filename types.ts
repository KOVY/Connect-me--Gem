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

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'vip';

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
}

export type EducationLevel = 'high_school' | 'bachelors' | 'masters' | 'phd';
export type SmokingPreference = 'never' | 'sometimes' | 'regularly';
export type DrinkingPreference = 'never' | 'socially' | 'regularly';
export type PetPreference = 'no_pets' | 'has_cats' | 'has_dogs' | 'has_other';

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

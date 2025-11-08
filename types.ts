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
}

export interface User extends Omit<UserProfile, 'age' | 'country' | 'lastSeen' | 'hobbies'> {
    credits: number;
    transactions: Transaction[];
    profilePictureUrl: string; // Renamed from imageUrl for clarity
    subscription?: UserSubscription; // Current subscription
    superLikesRemaining?: number; // Super likes available
    boostsRemaining?: number; // Profile boosts available
    rewindsRemaining?: number; // Rewinds available
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

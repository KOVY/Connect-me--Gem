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
}

export interface User extends Omit<UserProfile, 'age' | 'country' | 'lastSeen' | 'hobbies'> {
    credits: number;
    transactions: Transaction[];
    profilePictureUrl: string; // Renamed from imageUrl for clarity
}

export interface ChatMessage {
    id:string;
    sender: 'user' | 'ai' | 'system';
    type: 'text' | 'gift';
    text?: string;
    timestamp: string; // ISO string date
    reactions?: Record<string, string[]>; // emoji -> userIds[]
    gift?: Gift;
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

export type SupportedLanguage = 'en' | 'cs';
export type SupportedCountry = 'US' | 'GB' | 'DE' | 'FR' | 'ES' | 'IT' | 'CZ';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CZK';

export interface LocaleContextState {
    locale: string;
    language: SupportedLanguage;
    country: SupportedCountry;
    currency: SupportedCurrency;
}

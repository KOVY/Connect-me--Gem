// FIX: Creating type definitions for the application.
export type SupportedLanguage = 'en' | 'cs';
export type SupportedCountry = 'US' | 'GB' | 'DE' | 'FR' | 'ES' | 'IT' | 'CZ';
export type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'CZK';

export interface LocaleContextState {
    locale: string;
    language: SupportedLanguage;
    country: SupportedCountry;
    currency: SupportedCurrency;
}

export interface UserProfile {
    id: string;
    name: string;
    age: number;
    bio: string;
    imageUrl: string;
    country: string;
    lastSeen: string; // ISO 8601 date string
}

export interface Gift {
    id: string;
    name: string;
    icon: string;
    cost: number;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai' | 'system';
    type: 'text' | 'gift';
    text?: string;
    gift?: Gift;
    timestamp: string;
    reactions?: Record<string, string[]>; // e.g. { '❤️': ['user_id_1'], '👍': ['user_id_1', 'user_id_2'] }
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number; // positive for credits added, negative for credits spent
}

export interface User {
    id: string;
    name: string;
    bio: string;
    interests: string[];
    credits: number;
    transactions: Transaction[];
    profilePictureUrl: string;
}

export interface CreditPackage {
    id:string;
    credits: number;
    price: number;
    currency: SupportedCurrency;
}
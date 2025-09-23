import { User, Transaction, Gift } from './types';
import { CREDIT_PACKAGES } from './constants';

// --- SIMULATED DATABASE ---
let MOCK_USER: User = {
    id: 'user_123',
    name: 'Alex',
    // FIX: Add missing 'imageUrl' property to satisfy the User interface which extends UserProfile.
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    bio: 'Just a person exploring the world. I love hiking, coding, and a good cup of tea.',
    occupation: 'Software Engineer',
    interests: ['Hiking', 'Coding', 'Tea'],
    credits: 500,
    transactions: [
        { id: 'tx1', date: '2023-10-26', description: 'Initial credit grant', amount: 500 },
    ],
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
};

// --- SIMULATED API LATENCY ---
const apiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- API FUNCTIONS ---

export const fetchUserData = async (): Promise<User> => {
    await apiDelay();
    console.log("API: Fetched user data", MOCK_USER);
    return JSON.parse(JSON.stringify(MOCK_USER)); // Return a copy
};

export const updateUserProfile = async (updates: Partial<Pick<User, 'name' | 'bio' | 'interests' | 'profilePictureUrl' | 'occupation'>>): Promise<User> => {
    await apiDelay();
    MOCK_USER = { ...MOCK_USER, ...updates };
    console.log("API: Updated user data", MOCK_USER);
    return JSON.parse(JSON.stringify(MOCK_USER));
};

export const processGiftPurchase = async (gift: Gift, recipientName: string): Promise<{ user: User, transaction: Transaction }> => {
    await apiDelay(700);
    if (MOCK_USER.credits < gift.cost) {
        throw new Error("Insufficient credits");
    }
    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Sent ${gift.name} to ${recipientName}`,
        amount: -gift.cost,
    };
    MOCK_USER.credits -= gift.cost;
    MOCK_USER.transactions.unshift(newTransaction);
    console.log("API: Processed gift purchase", { user: MOCK_USER, transaction: newTransaction });
    return {
        user: JSON.parse(JSON.stringify(MOCK_USER)),
        transaction: newTransaction
    };
};

export const processCreditPurchase = async (packageId: string): Promise<{ user: User, transaction: Transaction }> => {
    await apiDelay(1000);
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
        throw new Error("Credit package not found");
    }
    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Purchased ${pkg.credits} credits`,
        amount: pkg.credits,
    };
    MOCK_USER.credits += pkg.credits;
    MOCK_USER.transactions.unshift(newTransaction);
    console.log("API: Processed credit purchase", { user: MOCK_USER, transaction: newTransaction });
    return {
        user: JSON.parse(JSON.stringify(MOCK_USER)),
        transaction: newTransaction
    };
};
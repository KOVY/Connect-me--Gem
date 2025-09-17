// FIX: Creating a mock API for the application.
import { User, Gift, CreditPackage, Transaction } from './types';
import { CREDIT_PACKAGES } from './constants';

const USER_KEY = 'dating_app_user';

// Mock user data
const getInitialUser = (): User => ({
    id: 'current_user',
    name: 'Alex',
    bio: 'Just exploring the world and looking for new connections.',
    interests: ['photography', 'travel', 'foodie'],
    credits: 100,
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    transactions: [
        { id: 'tx1', date: '2023-10-26', description: 'Welcome bonus', amount: 100 }
    ],
});

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const api = {
    getCurrentUser: async (): Promise<User> => {
        await delay(500);
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        const initialUser = getInitialUser();
        localStorage.setItem(USER_KEY, JSON.stringify(initialUser));
        return initialUser;
    },

    updateUserProfile: async (updates: Partial<User>): Promise<User> => {
        await delay(800);
        const user = await api.getCurrentUser();
        const updatedUser = { ...user, ...updates };
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    },
    
    purchaseCredits: async (packageId: string): Promise<{ user: User, transaction: Transaction }> => {
        await delay(1200);
        const user = await api.getCurrentUser();
        const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
        
        if (!pkg) {
            throw new Error('Credit package not found.');
        }

        const newTransaction: Transaction = {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: `Purchased ${pkg.credits} credits`,
            amount: pkg.credits,
        };
        
        const updatedUser: User = {
            ...user,
            credits: user.credits + pkg.credits,
            transactions: [newTransaction, ...user.transactions],
        };
        
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return { user: updatedUser, transaction: newTransaction };
    },

    sendGift: async (gift: Gift, recipientName: string): Promise<{ user: User, transaction: Transaction }> => {
        await delay(700);
        const user = await api.getCurrentUser();

        if (user.credits < gift.cost) {
            throw new Error('Insufficient credits.');
        }

        const newTransaction: Transaction = {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: `Sent a ${gift.name} to ${recipientName}`,
            amount: -gift.cost,
        };
        
        const updatedUser: User = {
            ...user,
            credits: user.credits - gift.cost,
            transactions: [newTransaction, ...user.transactions],
        };
        
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return { user: updatedUser, transaction: newTransaction };
    },
};

export { api };
import { User, Transaction, Gift, UserSubscription, ProfileLike } from './types';
import { CREDIT_PACKAGES, SUBSCRIPTION_PLANS, PROFILES } from './constants';

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
    subscription: undefined, // Free tier by default
    superLikesRemaining: 0, // Free users don't get super likes
    boostsRemaining: 0, // Free users don't get boosts
    rewindsRemaining: 0, // Free users don't get rewinds
    likedBy: [
        {
            profileId: 'prof_1',
            profile: PROFILES[0],
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            isSuperLike: false,
            isMatch: false,
        },
        {
            profileId: 'prof_2',
            profile: PROFILES[1],
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            isSuperLike: true,
            isMatch: false,
        },
        {
            profileId: 'prof_3',
            profile: PROFILES[2],
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            isSuperLike: false,
            isMatch: false,
        },
    ],
    likedProfiles: [],
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

export const processSubscription = async (planId: string): Promise<{ user: User, transaction: Transaction }> => {
    await apiDelay(1000);
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
        throw new Error("Subscription plan not found");
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month

    const subscription: UserSubscription = {
        tier: plan.tier,
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        autoRenew: true,
    };

    // Set subscription benefits based on tier
    let superLikes = 0;
    let boosts = 0;
    let rewinds = 999; // Effectively unlimited
    let creditBonus = 0;

    if (plan.tier === 'basic') {
        superLikes = 5;
        boosts = 1;
    } else if (plan.tier === 'premium') {
        superLikes = 10;
        boosts = 2;
    } else if (plan.tier === 'vip') {
        superLikes = 999; // Unlimited
        boosts = 5;
        creditBonus = 500;
    }

    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Subscribed to ${plan.name} (${plan.duration})`,
        amount: -plan.price, // Negative for expense
    };

    MOCK_USER.subscription = subscription;
    MOCK_USER.superLikesRemaining = superLikes;
    MOCK_USER.boostsRemaining = boosts;
    MOCK_USER.rewindsRemaining = rewinds;

    // Add credit bonus and verified badge for VIP
    if (plan.tier === 'vip') {
        MOCK_USER.credits += creditBonus;
        MOCK_USER.verified = true; // VIP users get verified badge
    } else {
        MOCK_USER.verified = false; // Remove badge for non-VIP tiers
    }

    MOCK_USER.transactions.unshift(newTransaction);
    console.log("API: Processed subscription", { user: MOCK_USER, transaction: newTransaction });

    return {
        user: JSON.parse(JSON.stringify(MOCK_USER)),
        transaction: newTransaction
    };
};

export const cancelSubscription = async (): Promise<User> => {
    await apiDelay(800);

    if (MOCK_USER.subscription) {
        MOCK_USER.subscription.autoRenew = false;
    }

    console.log("API: Cancelled subscription auto-renewal", MOCK_USER);
    return JSON.parse(JSON.stringify(MOCK_USER));
};

export const useBoost = async (): Promise<User> => {
    await apiDelay(500);

    if (!MOCK_USER.boostsRemaining || MOCK_USER.boostsRemaining <= 0) {
        throw new Error("No boosts remaining");
    }

    MOCK_USER.boostsRemaining -= 1;

    const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Used Profile Boost`,
        amount: 0, // No credit cost for subscription users
    };

    MOCK_USER.transactions.unshift(newTransaction);
    console.log("API: Used boost", MOCK_USER);

    return JSON.parse(JSON.stringify(MOCK_USER));
};

export const useSuperLike = async (profileId: string): Promise<User> => {
    await apiDelay(500);

    if (!MOCK_USER.superLikesRemaining || MOCK_USER.superLikesRemaining <= 0) {
        throw new Error("No super likes remaining");
    }

    MOCK_USER.superLikesRemaining -= 1;

    console.log(`API: Used super like on profile ${profileId}`, MOCK_USER);
    return JSON.parse(JSON.stringify(MOCK_USER));
};

export const useRewind = async (): Promise<User> => {
    await apiDelay(500);

    if (!MOCK_USER.rewindsRemaining || MOCK_USER.rewindsRemaining <= 0) {
        throw new Error("No rewinds remaining");
    }

    MOCK_USER.rewindsRemaining -= 1;

    console.log("API: Used rewind", MOCK_USER);
    return JSON.parse(JSON.stringify(MOCK_USER));
};
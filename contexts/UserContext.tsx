// FIX: Implementing the UserContext to provide user data and actions throughout the application.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { User, Gift, Transaction } from '../types';

interface UserContextState {
    user: User | null;
    isLoading: boolean;
    transactions: Transaction[];
    fetchUser: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    purchaseCredits: (packageId: string) => Promise<void>;
    sendGift: (gift: Gift, recipientName: string) => Promise<void>;
}

const UserContext = createContext<UserContextState | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            // FIX: Corrected function name from api.fetchUser to api.getCurrentUser to match the implementation in api.ts.
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const updateUser = async (updates: Partial<User>) => {
        setIsLoading(true);
        try {
            const updatedUser = await api.updateUserProfile(updates);
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to update user profile", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const purchaseCredits = async (packageId: string) => {
        setIsLoading(true);
        try {
            const { user: updatedUser } = await api.purchaseCredits(packageId);
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to purchase credits", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    const sendGift = async (gift: Gift, recipientName: string) => {
        if (!user || user.credits < gift.cost) {
            throw new Error("Insufficient credits");
        }
        setIsLoading(true);
        try {
            // FIX: Destructured the response from api.sendGift to correctly extract the updated user object for the state update.
            const { user: updatedUser } = await api.sendGift(gift, recipientName);
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to send gift", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        transactions: user?.transactions ?? [],
        fetchUser,
        updateUser,
        purchaseCredits,
        sendGift,
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
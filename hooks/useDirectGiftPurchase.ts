import { useState, useCallback } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface DirectGiftPurchaseOptions {
    giftId: string;
    recipientId: string;
    recipientName: string;
}

interface DirectGiftPurchaseResult {
    sessionId: string;
    url: string;
    giftName: string;
    price: number;
    currency: string;
}

/**
 * Hook for direct gift purchase (Pay-per-Gift for FREE users)
 *
 * Allows users to buy a single gift without purchasing credit packs.
 * Redirects to Stripe Checkout and handles payment.
 *
 * @example
 * const { purchaseGift, isLoading, error } = useDirectGiftPurchase();
 *
 * const handleBuyGift = async () => {
 *   await purchaseGift({
 *     giftId: 'gift_1',
 *     recipientId: 'user-123',
 *     recipientName: 'Anna'
 *   });
 * };
 */
export const useDirectGiftPurchase = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currency } = useLocale();

    /**
     * Purchase and send a gift directly (without using credits)
     */
    const purchaseGift = useCallback(async ({
        giftId,
        recipientId,
        recipientName
    }: DirectGiftPurchaseOptions): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

            // Get auth token from Supabase
            const { data: { session } } = await (window as any).supabase.auth.getSession();

            if (!session) {
                throw new Error('You must be logged in to purchase gifts');
            }

            const response = await fetch(
                `${SUPABASE_URL}/functions/v1/buy-gift-directly`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        giftId,
                        recipientId,
                        recipientName,
                        currency,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create gift purchase session');
            }

            const data: DirectGiftPurchaseResult = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = data.url;

        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to purchase gift';
            setError(errorMessage);
            console.error('Direct gift purchase error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currency]);

    /**
     * Check if user should see direct purchase option
     * (e.g., FREE tier with insufficient credits)
     */
    const shouldShowDirectPurchase = useCallback((
        userCredits: number,
        giftCost: number,
        userTier: string
    ): boolean => {
        // Show direct purchase if:
        // 1. User is FREE tier
        // 2. User doesn't have enough credits
        return userTier === 'free' && userCredits < giftCost;
    }, []);

    /**
     * Calculate real-money price for a gift
     */
    const calculateGiftPrice = useCallback((creditCost: number): number => {
        // Simple pricing: 1 credit ≈ $0.01
        // With nice rounding
        if (creditCost <= 50) return 0.99;
        if (creditCost <= 100) return 1.49;
        if (creditCost <= 150) return 1.99;
        if (creditCost <= 200) return 2.49;
        if (creditCost <= 500) return 4.99;

        return Math.ceil(creditCost * 0.01);
    }, []);

    return {
        purchaseGift,
        shouldShowDirectPurchase,
        calculateGiftPrice,
        isLoading,
        error,
    };
};

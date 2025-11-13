import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Load Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance (singleton)
 */
export const getStripe = () => {
    if (!stripePromise) {
        if (!stripePublishableKey) {
            console.warn('⚠️ Missing Stripe publishable key. Payment features disabled.');
            console.warn('Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(stripePublishableKey);
    }
    return stripePromise;
};

/**
 * Tier subscription plans configuration
 */
export const SUBSCRIPTION_PLANS = {
    premium: {
        monthly: {
            priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
            price: 9.99,
            interval: 'month',
        },
        yearly: {
            priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
            price: 99.99,
            interval: 'year',
        },
    },
    vip: {
        monthly: {
            priceId: import.meta.env.VITE_STRIPE_VIP_MONTHLY_PRICE_ID,
            price: 29.99,
            interval: 'month',
        },
        yearly: {
            priceId: import.meta.env.VITE_STRIPE_VIP_YEARLY_PRICE_ID,
            price: 299.99,
            interval: 'year',
        },
    },
} as const;

/**
 * Create Stripe Checkout Session for subscription
 */
export const createCheckoutSession = async (
    tier: 'premium' | 'vip',
    billingPeriod: 'monthly' | 'yearly',
    userId: string,
    successUrl: string,
    cancelUrl: string
): Promise<{ sessionId: string; url: string } | null> => {
    try {
        const priceId = SUBSCRIPTION_PLANS[tier][billingPeriod].priceId;

        if (!priceId) {
            console.error(`Missing Stripe Price ID for ${tier} ${billingPeriod}`);
            return null;
        }

        // Call Supabase Edge Function to create checkout session
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: {
                priceId,
                userId,
                tier,
                billingPeriod,
                successUrl,
                cancelUrl,
            },
        });

        if (error) {
            console.error('Error creating checkout session:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return null;
    }
};

/**
 * Create Stripe Checkout Session for credits purchase
 */
export const createCreditCheckoutSession = async (
    packageId: string,
    credits: number,
    price: number,
    userId: string,
    successUrl: string,
    cancelUrl: string
): Promise<{ sessionId: string; url: string } | null> => {
    try {
        // Call Supabase Edge Function to create checkout session for credits
        const { data, error } = await supabase.functions.invoke('create-credit-checkout-session', {
            body: {
                packageId,
                credits,
                price,
                userId,
                successUrl,
                cancelUrl,
            },
        });

        if (error) {
            console.error('Error creating credit checkout session:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error creating credit checkout session:', error);
        return null;
    }
};

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
    const stripe = await getStripe();

    if (!stripe) {
        console.error('Stripe not initialized');
        return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
        console.error('Error redirecting to checkout:', error);
    }
};

/**
 * Create Stripe Customer Portal session (for managing subscription)
 */
export const createPortalSession = async (
    userId: string,
    returnUrl: string
): Promise<{ url: string } | null> => {
    try {
        const { data, error } = await supabase.functions.invoke('create-portal-session', {
            body: {
                userId,
                returnUrl,
            },
        });

        if (error) {
            console.error('Error creating portal session:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error creating portal session:', error);
        return null;
    }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.functions.invoke('cancel-subscription', {
            body: {
                userId,
            },
        });

        if (error) {
            console.error('Error canceling subscription:', error);
            return false;
        }

        return data?.success || false;
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return false;
    }
};

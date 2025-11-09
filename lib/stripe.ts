/**
 * 💳 STRIPE INTEGRATION
 *
 * Handles:
 * - Credit purchases (Stripe Checkout)
 * - Payouts (Stripe Payouts API)
 * - Webhooks for payment confirmation
 */

import { CreditPackage } from './creditPricing';

// Stripe publishable key from env
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

/**
 * Initialize Stripe Checkout for credit purchase
 */
export async function createCreditCheckoutSession(
  creditPackage: CreditPackage,
  authToken: string
): Promise<{ sessionId: string; url: string }> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        packageId: creditPackage.id,
        creditAmount: creditPackage.creditAmount,
        price: creditPackage.price,
        currency: creditPackage.currency,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  return {
    sessionId: data.sessionId,
    url: data.url,
  };
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(
  creditPackage: CreditPackage,
  authToken: string
): Promise<void> {
  try {
    const { url } = await createCreditCheckoutSession(creditPackage, authToken);

    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

/**
 * Request payout via Stripe
 */
export async function requestPayout(
  currency: string,
  paymentMethod: 'bank_account' | 'paypal',
  paymentDetails: {
    email?: string;
    iban?: string;
    accountNumber?: string;
    routingNumber?: string;
  },
  authToken: string
): Promise<{ payoutRequestId: string; message: string }> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/request-payout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        currency,
        paymentMethod,
        paymentDetails,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to request payout');
  }

  const data = await response.json();
  return {
    payoutRequestId: data.payoutRequestId,
    message: data.message,
  };
}

/**
 * Get Stripe pricing table (for frontend display)
 */
export function getStripePricingConfig() {
  return {
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    successUrl: `${window.location.origin}/profile/me/shop?payment=success`,
    cancelUrl: `${window.location.origin}/profile/me/shop?payment=cancelled`,
  };
}

/**
 * Process gift purchase with credits
 * This deducts credits from sender and adds earned_credits to recipient
 */
export async function processGiftPurchase(
  recipientId: string,
  giftId: string,
  creditCost: number,
  authToken: string
): Promise<{ success: boolean; transactionId: string; senderNewBalance: number }> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/send-gift`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        recipientId,
        giftId,
        creditCost,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send gift');
  }

  const data = await response.json();
  return {
    success: data.success,
    transactionId: data.transactionId,
    senderNewBalance: data.senderNewBalance,
  };
}

/**
 * Verify payment success (after redirect from Stripe)
 */
export async function verifyPaymentSuccess(sessionId: string): Promise<{
  success: boolean;
  creditsAdded: number;
}> {
  const response = await fetch(`/api/stripe/verify-session/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  const data = await response.json();
  return {
    success: data.paymentStatus === 'paid',
    creditsAdded: data.creditsAdded,
  };
}

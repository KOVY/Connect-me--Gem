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
  userId: string,
  userEmail: string
): Promise<{ sessionId: string; url: string }> {
  // TODO: Replace with actual Stripe API call
  // This would call your backend endpoint which creates a Stripe Checkout Session

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      packageId: creditPackage.id,
      creditAmount: creditPackage.creditAmount,
      price: creditPackage.price,
      currency: creditPackage.currency,
      userId,
      userEmail,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
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
  userId: string,
  userEmail: string
): Promise<void> {
  try {
    const { url } = await createCreditCheckoutSession(creditPackage, userId, userEmail);

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
  userId: string,
  amountUsd: number,
  currency: string,
  paymentMethod: 'bank_account' | 'paypal',
  paymentDetails: {
    email?: string;
    iban?: string;
    accountNumber?: string;
    routingNumber?: string;
  }
): Promise<{ payoutRequestId: string }> {
  // TODO: Replace with actual API call to backend
  // Backend will:
  // 1. Validate user has enough balance
  // 2. Calculate commission (60%)
  // 3. Create payout_request in Supabase
  // 4. Initiate Stripe Payout (or queue for manual processing)

  const response = await fetch('/api/stripe/request-payout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      amountUsd,
      currency,
      paymentMethod,
      paymentDetails,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to request payout');
  }

  const data = await response.json();
  return {
    payoutRequestId: data.payoutRequestId,
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
  senderId: string,
  recipientId: string,
  giftId: string,
  creditCost: number
): Promise<{ success: boolean; transactionId: string }> {
  // TODO: Replace with actual Supabase function call
  // This should be a Postgres function or Edge Function that:
  // 1. Checks sender has enough credits
  // 2. Deducts from sender's purchased_credits or balance
  // 3. Adds to recipient's earned_credits
  // 4. Creates transaction record
  // 5. Updates cash_balance_usd for recipient

  const response = await fetch('/api/credits/send-gift', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senderId,
      recipientId,
      giftId,
      creditCost,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send gift');
  }

  const data = await response.json();
  return {
    success: true,
    transactionId: data.transactionId,
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

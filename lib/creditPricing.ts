/**
 * 💰 CREDIT PRICING & PAYOUT SYSTEM
 *
 * International pricing with anti-arbitrage protection
 * Fixed exchange rates (3-5% below market to prevent cross-border shopping)
 * 60% platform commission on payouts (like TikTok)
 */

export interface CreditPackage {
  id: string;
  packageName: string;
  creditAmount: number;
  currency: string;
  price: number;
  priceUsd: number;
  isActive: boolean;
  sortOrder: number;
  discountPercent?: number; // Calculated discount vs base price
}

export interface ExchangeRate {
  currency: string;
  rateToUsd: number;
  displaySymbol: string;
  countryCode: string;
  isActive: boolean;
  notes?: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amountUsd: number;
  amountAfterCommission: number; // 40% of amountUsd
  commissionRate: number; // 0.60 (60%)
  currency: string;
  payoutAmount: number; // Final amount in target currency
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  stripePayoutId?: string;
  paymentMethod?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedReason?: string;
}

export interface CreditBalance {
  userId: string;
  balance: number; // Total: purchased + earned
  purchasedCredits: number; // Bought via Stripe
  earnedCredits: number; // Received from gifts
  cashBalanceUsd: number; // Available for payout
  lifetimeEarningsUsd: number; // Total ever earned
  lifetimeSpentCredits: number; // Total ever spent
}

/**
 * Platform Economics Constants
 */
export const PLATFORM_COMMISSION_RATE = 0.60; // 60% commission
export const USER_PAYOUT_RATE = 0.40; // User gets 40%
export const MIN_PAYOUT_USD = 10.00; // Minimum $10 to request payout

/**
 * Gift Credit Values
 * When user sends a gift, recipient receives credits
 */
export const GIFT_CREDIT_VALUES: Record<string, number> = {
  'rose': 10,
  'heart': 20,
  'diamond': 50,
  'champagne': 100,
  'luxury_car': 500,
};

/**
 * Credit to USD conversion
 * 100 credits = $1 USD (base rate)
 */
export const CREDITS_PER_USD = 100;

/**
 * Calculate payout amount after commission
 */
export function calculatePayoutAmount(creditsEarned: number): {
  totalUsd: number;
  platformCommissionUsd: number;
  userPayoutUsd: number;
} {
  const totalUsd = creditsEarned / CREDITS_PER_USD;
  const platformCommissionUsd = totalUsd * PLATFORM_COMMISSION_RATE;
  const userPayoutUsd = totalUsd * USER_PAYOUT_RATE;

  return {
    totalUsd,
    platformCommissionUsd,
    userPayoutUsd,
  };
}

/**
 * Calculate discount percentage for a package
 */
export function calculateDiscount(creditAmount: number, priceUsd: number): number {
  const baseRate = 0.05; // $0.05 per credit (100 credits = $5)
  const basePrice = creditAmount * baseRate;
  const discount = ((basePrice - priceUsd) / basePrice) * 100;
  return Math.max(0, Math.round(discount));
}

/**
 * Get display price with currency symbol
 */
export function formatPrice(amount: number, currency: string, symbol: string): string {
  // Different currencies have different formatting
  if (currency === 'CZK' || currency === 'PLN' || currency === 'HUF') {
    // Symbol after amount for some currencies
    return `${amount.toFixed(2)} ${symbol}`;
  }
  // Symbol before amount for USD, EUR, GBP, etc.
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Validate payout request
 */
export function validatePayoutRequest(
  earnedCredits: number,
  cashBalanceUsd: number
): { valid: boolean; error?: string } {
  const { userPayoutUsd } = calculatePayoutAmount(earnedCredits);

  if (userPayoutUsd < MIN_PAYOUT_USD) {
    return {
      valid: false,
      error: `Minimum payout is $${MIN_PAYOUT_USD}. You need ${Math.ceil((MIN_PAYOUT_USD - userPayoutUsd) * CREDITS_PER_USD)} more credits.`,
    };
  }

  if (cashBalanceUsd < MIN_PAYOUT_USD) {
    return {
      valid: false,
      error: `Insufficient balance for payout.`,
    };
  }

  return { valid: true };
}

/**
 * Anti-arbitrage check
 * Verify user isn't trying to exploit currency differences
 */
export function checkArbitrageRisk(
  userCountry: string,
  purchaseCurrency: string
): { risk: boolean; message?: string } {
  // If user's country doesn't match purchase currency, flag it
  const countryToCurrency: Record<string, string> = {
    'CZ': 'CZK',
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'PL': 'PLN',
    'CA': 'CAD',
    'AU': 'AUD',
  };

  const expectedCurrency = countryToCurrency[userCountry];

  if (expectedCurrency && purchaseCurrency !== expectedCurrency) {
    return {
      risk: true,
      message: `User from ${userCountry} purchasing in ${purchaseCurrency}. Review for arbitrage.`,
    };
  }

  return { risk: false };
}

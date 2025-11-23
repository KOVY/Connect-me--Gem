import { describe, it, expect } from 'vitest';
import {
  calculatePayoutAmount,
  calculateDiscount,
  formatPrice,
  validatePayoutRequest,
  checkArbitrageRisk,
  PLATFORM_COMMISSION_RATE,
  USER_PAYOUT_RATE,
  MIN_PAYOUT_USD,
  CREDITS_PER_USD,
  GIFT_CREDIT_VALUES,
} from '../lib/creditPricing';

describe('Credit Pricing Constants', () => {
  it('should have correct platform commission rate (60%)', () => {
    expect(PLATFORM_COMMISSION_RATE).toBe(0.60);
  });

  it('should have correct user payout rate (40%)', () => {
    expect(USER_PAYOUT_RATE).toBe(0.40);
  });

  it('should have commission and payout rates sum to 100%', () => {
    expect(PLATFORM_COMMISSION_RATE + USER_PAYOUT_RATE).toBe(1.0);
  });

  it('should have minimum payout of $10', () => {
    expect(MIN_PAYOUT_USD).toBe(10.00);
  });

  it('should have 100 credits per USD', () => {
    expect(CREDITS_PER_USD).toBe(100);
  });

  it('should have correct gift credit values', () => {
    expect(GIFT_CREDIT_VALUES['rose']).toBe(10);
    expect(GIFT_CREDIT_VALUES['heart']).toBe(20);
    expect(GIFT_CREDIT_VALUES['diamond']).toBe(50);
    expect(GIFT_CREDIT_VALUES['champagne']).toBe(100);
    expect(GIFT_CREDIT_VALUES['luxury_car']).toBe(500);
  });
});

describe('calculatePayoutAmount', () => {
  it('should correctly calculate payout for 100 credits ($1 USD)', () => {
    const result = calculatePayoutAmount(100);

    expect(result.totalUsd).toBe(1.00);
    expect(result.platformCommissionUsd).toBe(0.60);
    expect(result.userPayoutUsd).toBe(0.40);
  });

  it('should correctly calculate payout for 1000 credits ($10 USD)', () => {
    const result = calculatePayoutAmount(1000);

    expect(result.totalUsd).toBe(10.00);
    expect(result.platformCommissionUsd).toBe(6.00);
    expect(result.userPayoutUsd).toBe(4.00);
  });

  it('should correctly calculate payout for large amounts (10000 credits = $100)', () => {
    const result = calculatePayoutAmount(10000);

    expect(result.totalUsd).toBe(100.00);
    expect(result.platformCommissionUsd).toBe(60.00);
    expect(result.userPayoutUsd).toBe(40.00);
  });

  it('should handle zero credits', () => {
    const result = calculatePayoutAmount(0);

    expect(result.totalUsd).toBe(0);
    expect(result.platformCommissionUsd).toBe(0);
    expect(result.userPayoutUsd).toBe(0);
  });

  it('should handle fractional results correctly', () => {
    const result = calculatePayoutAmount(250); // $2.50

    expect(result.totalUsd).toBe(2.50);
    expect(result.platformCommissionUsd).toBe(1.50);
    expect(result.userPayoutUsd).toBe(1.00);
  });

  it('should maintain the invariant: commission + payout = total', () => {
    const testAmounts = [100, 500, 1000, 2500, 5000, 10000];

    testAmounts.forEach(credits => {
      const result = calculatePayoutAmount(credits);
      expect(result.platformCommissionUsd + result.userPayoutUsd).toBeCloseTo(result.totalUsd, 10);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return 0% discount when price equals base rate', () => {
    // Base rate: $0.05 per credit
    // 100 credits at base rate = $5
    const discount = calculateDiscount(100, 5.00);
    expect(discount).toBe(0);
  });

  it('should calculate correct discount for cheaper packages', () => {
    // 100 credits at base rate = $5
    // If price is $4, discount = (5-4)/5 * 100 = 20%
    const discount = calculateDiscount(100, 4.00);
    expect(discount).toBe(20);
  });

  it('should calculate 50% discount correctly', () => {
    // 200 credits at base rate = $10
    // If price is $5, discount = (10-5)/10 * 100 = 50%
    const discount = calculateDiscount(200, 5.00);
    expect(discount).toBe(50);
  });

  it('should return 0 if price is higher than base (no negative discounts)', () => {
    // 100 credits at base rate = $5
    // If price is $6, should return 0 (not -20%)
    const discount = calculateDiscount(100, 6.00);
    expect(discount).toBe(0);
  });

  it('should round to whole numbers', () => {
    // 100 credits = $5 base, price $3.33 = 33.4% -> 33%
    const discount = calculateDiscount(100, 3.33);
    expect(Number.isInteger(discount)).toBe(true);
  });
});

describe('formatPrice', () => {
  it('should format USD with symbol before amount', () => {
    const formatted = formatPrice(9.99, 'USD', '$');
    expect(formatted).toBe('$10'); // Rounded to whole number
  });

  it('should format EUR with symbol before amount', () => {
    const formatted = formatPrice(19.50, 'EUR', '€');
    expect(formatted).toBe('€20'); // Rounded
  });

  it('should format GBP with symbol before amount', () => {
    const formatted = formatPrice(8.49, 'GBP', '£');
    expect(formatted).toBe('£8');
  });

  it('should format CZK with symbol after amount', () => {
    const formatted = formatPrice(249, 'CZK', 'Kč');
    expect(formatted).toBe('249 Kč');
  });

  it('should format PLN with symbol after amount', () => {
    const formatted = formatPrice(45.50, 'PLN', 'zł');
    expect(formatted).toBe('46 zł'); // Rounded
  });

  it('should format HUF with symbol after amount', () => {
    const formatted = formatPrice(3500, 'HUF', 'Ft');
    expect(formatted).toBe('3500 Ft');
  });

  it('should round to whole numbers (no decimals)', () => {
    expect(formatPrice(9.99, 'USD', '$')).toBe('$10');
    expect(formatPrice(9.49, 'USD', '$')).toBe('$9');
    expect(formatPrice(9.50, 'USD', '$')).toBe('$10');
  });
});

describe('validatePayoutRequest', () => {
  it('should reject payout below minimum ($10)', () => {
    // 2000 credits = $20 total, 40% = $8 payout (below $10)
    const result = validatePayoutRequest(2000, 8);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Minimum payout is $10');
  });

  it('should accept payout at minimum threshold', () => {
    // 2500 credits = $25 total, 40% = $10 payout (exactly $10)
    const result = validatePayoutRequest(2500, 10);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept payout above minimum', () => {
    // 5000 credits = $50 total, 40% = $20 payout
    const result = validatePayoutRequest(5000, 20);

    expect(result.valid).toBe(true);
  });

  it('should reject when cash balance is insufficient', () => {
    // Earned enough credits but cash balance is low
    const result = validatePayoutRequest(5000, 5);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Insufficient balance');
  });

  it('should calculate required credits in error message', () => {
    // 1000 credits = $10 total, 40% = $4 payout (need $6 more = 600 credits)
    const result = validatePayoutRequest(1000, 4);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('more credits');
  });
});

describe('checkArbitrageRisk', () => {
  it('should detect no risk when currency matches country', () => {
    expect(checkArbitrageRisk('CZ', 'CZK').risk).toBe(false);
    expect(checkArbitrageRisk('US', 'USD').risk).toBe(false);
    expect(checkArbitrageRisk('GB', 'GBP').risk).toBe(false);
    expect(checkArbitrageRisk('PL', 'PLN').risk).toBe(false);
  });

  it('should detect risk when currency does not match country', () => {
    const result = checkArbitrageRisk('CZ', 'USD');

    expect(result.risk).toBe(true);
    expect(result.message).toContain('CZ');
    expect(result.message).toContain('USD');
  });

  it('should flag US user purchasing in CZK', () => {
    const result = checkArbitrageRisk('US', 'CZK');

    expect(result.risk).toBe(true);
    expect(result.message).toContain('arbitrage');
  });

  it('should not flag unknown countries (no expected currency)', () => {
    const result = checkArbitrageRisk('JP', 'JPY');

    expect(result.risk).toBe(false);
  });

  it('should handle EU country with EUR correctly', () => {
    const result = checkArbitrageRisk('EU', 'EUR');

    expect(result.risk).toBe(false);
  });

  it('should flag EU user purchasing in USD', () => {
    const result = checkArbitrageRisk('EU', 'USD');

    expect(result.risk).toBe(true);
  });
});

describe('Gift Credit Values Integration', () => {
  it('should calculate correct payout for rose gift (10 credits)', () => {
    const roseCredits = GIFT_CREDIT_VALUES['rose'];
    const result = calculatePayoutAmount(roseCredits);

    expect(result.totalUsd).toBeCloseTo(0.10, 10);
    expect(result.userPayoutUsd).toBeCloseTo(0.04, 10);
  });

  it('should calculate correct payout for luxury_car gift (500 credits)', () => {
    const carCredits = GIFT_CREDIT_VALUES['luxury_car'];
    const result = calculatePayoutAmount(carCredits);

    expect(result.totalUsd).toBe(5.00);
    expect(result.userPayoutUsd).toBe(2.00);
  });

  it('should require multiple gifts to reach minimum payout', () => {
    // $10 payout needed, 40% rate means need $25 total = 2500 credits
    // Rose = 10 credits, need 250 roses
    const roseCredits = GIFT_CREDIT_VALUES['rose'];
    const rosesNeeded = Math.ceil(2500 / roseCredits);

    expect(rosesNeeded).toBe(250);

    const payout = calculatePayoutAmount(rosesNeeded * roseCredits);
    expect(payout.userPayoutUsd).toBe(10);
  });
});

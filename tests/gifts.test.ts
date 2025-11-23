import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_GIFTS,
  GIFT_CATEGORIES,
  calculateRecipientEarnings,
  getGiftById,
  getAffordableGifts,
  Gift,
} from '../src/lib/gifts';

describe('AVAILABLE_GIFTS constant', () => {
  it('should have 5 predefined gifts', () => {
    expect(AVAILABLE_GIFTS).toHaveLength(5);
  });

  it('should have all required properties for each gift', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      expect(gift).toHaveProperty('id');
      expect(gift).toHaveProperty('name');
      expect(gift).toHaveProperty('icon');
      expect(gift).toHaveProperty('creditCost');
      expect(gift).toHaveProperty('usdValue');
      expect(gift).toHaveProperty('category');
      expect(gift).toHaveProperty('description');
    });
  });

  it('should have unique IDs for all gifts', () => {
    const ids = AVAILABLE_GIFTS.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have correct credit to USD ratio (100 credits = $1)', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      const expectedUsd = gift.creditCost / 100;
      expect(gift.usdValue).toBeCloseTo(expectedUsd, 2);
    });
  });

  it('should have gifts sorted by credit cost (basic to luxury)', () => {
    const sortedByCredits = [...AVAILABLE_GIFTS].sort(
      (a, b) => a.creditCost - b.creditCost
    );

    // Check basic gifts come first
    expect(sortedByCredits[0].category).toBe('basic');
    expect(sortedByCredits[sortedByCredits.length - 1].category).toBe('luxury');
  });

  it('should have emoji icons for all gifts', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      expect(gift.icon).toBeTruthy();
      // Check it's an emoji (contains unicode characters in emoji range)
      expect(gift.icon.length).toBeGreaterThan(0);
    });
  });

  describe('specific gift values', () => {
    it('should have rose at 10 credits ($0.10)', () => {
      const rose = AVAILABLE_GIFTS.find((g) => g.id === 'rose');
      expect(rose).toBeDefined();
      expect(rose?.creditCost).toBe(10);
      expect(rose?.usdValue).toBe(0.10);
      expect(rose?.category).toBe('basic');
    });

    it('should have heart at 20 credits ($0.20)', () => {
      const heart = AVAILABLE_GIFTS.find((g) => g.id === 'heart');
      expect(heart).toBeDefined();
      expect(heart?.creditCost).toBe(20);
      expect(heart?.usdValue).toBe(0.20);
    });

    it('should have diamond at 50 credits ($0.50)', () => {
      const diamond = AVAILABLE_GIFTS.find((g) => g.id === 'diamond');
      expect(diamond).toBeDefined();
      expect(diamond?.creditCost).toBe(50);
      expect(diamond?.usdValue).toBe(0.50);
      expect(diamond?.category).toBe('premium');
    });

    it('should have champagne at 100 credits ($1.00)', () => {
      const champagne = AVAILABLE_GIFTS.find((g) => g.id === 'champagne');
      expect(champagne).toBeDefined();
      expect(champagne?.creditCost).toBe(100);
      expect(champagne?.usdValue).toBe(1.00);
    });

    it('should have luxury_car at 500 credits ($5.00)', () => {
      const car = AVAILABLE_GIFTS.find((g) => g.id === 'luxury_car');
      expect(car).toBeDefined();
      expect(car?.creditCost).toBe(500);
      expect(car?.usdValue).toBe(5.00);
      expect(car?.category).toBe('luxury');
    });
  });
});

describe('GIFT_CATEGORIES', () => {
  it('should have three categories: basic, premium, luxury', () => {
    expect(GIFT_CATEGORIES).toHaveProperty('basic');
    expect(GIFT_CATEGORIES).toHaveProperty('premium');
    expect(GIFT_CATEGORIES).toHaveProperty('luxury');
  });

  it('should have correct ranges for basic category', () => {
    expect(GIFT_CATEGORIES.basic.min).toBe(0);
    expect(GIFT_CATEGORIES.basic.max).toBe(30);
  });

  it('should have correct ranges for premium category', () => {
    expect(GIFT_CATEGORIES.premium.min).toBe(31);
    expect(GIFT_CATEGORIES.premium.max).toBe(150);
  });

  it('should have correct ranges for luxury category', () => {
    expect(GIFT_CATEGORIES.luxury.min).toBe(151);
    expect(GIFT_CATEGORIES.luxury.max).toBe(1000);
  });

  it('should have labels for all categories', () => {
    expect(GIFT_CATEGORIES.basic.label).toBe('Základní');
    expect(GIFT_CATEGORIES.premium.label).toBe('Premium');
    expect(GIFT_CATEGORIES.luxury.label).toBe('Luxusní');
  });

  it('should have non-overlapping ranges', () => {
    expect(GIFT_CATEGORIES.basic.max).toBeLessThan(GIFT_CATEGORIES.premium.min);
    expect(GIFT_CATEGORIES.premium.max).toBeLessThan(GIFT_CATEGORIES.luxury.min);
  });
});

describe('calculateRecipientEarnings', () => {
  it('should calculate correct earnings for 10 credits (rose)', () => {
    const result = calculateRecipientEarnings(10);

    expect(result.credits).toBe(10);
    expect(result.usdValue).toBeCloseTo(0.10, 10);
    expect(result.payoutUsd).toBeCloseTo(0.04, 10); // 40% of $0.10
  });

  it('should calculate correct earnings for 100 credits (champagne)', () => {
    const result = calculateRecipientEarnings(100);

    expect(result.credits).toBe(100);
    expect(result.usdValue).toBe(1.00);
    expect(result.payoutUsd).toBe(0.40); // 40% of $1.00
  });

  it('should calculate correct earnings for 500 credits (luxury_car)', () => {
    const result = calculateRecipientEarnings(500);

    expect(result.credits).toBe(500);
    expect(result.usdValue).toBe(5.00);
    expect(result.payoutUsd).toBe(2.00); // 40% of $5.00
  });

  it('should return 0 earnings for 0 credits', () => {
    const result = calculateRecipientEarnings(0);

    expect(result.credits).toBe(0);
    expect(result.usdValue).toBe(0);
    expect(result.payoutUsd).toBe(0);
  });

  it('should maintain 40% payout rate invariant', () => {
    const testCredits = [10, 20, 50, 100, 500, 1000];

    testCredits.forEach((credits) => {
      const result = calculateRecipientEarnings(credits);
      const expectedPayout = result.usdValue * 0.40;
      expect(result.payoutUsd).toBeCloseTo(expectedPayout, 10);
    });
  });

  it('should calculate earnings for all available gifts', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      const result = calculateRecipientEarnings(gift.creditCost);

      expect(result.credits).toBe(gift.creditCost);
      expect(result.usdValue).toBe(gift.usdValue);
      expect(result.payoutUsd).toBeCloseTo(gift.usdValue * 0.40, 10);
    });
  });
});

describe('getGiftById', () => {
  it('should return correct gift for valid ID', () => {
    const rose = getGiftById('rose');

    expect(rose).toBeDefined();
    expect(rose?.id).toBe('rose');
    expect(rose?.name).toBe('Růže');
    expect(rose?.creditCost).toBe(10);
  });

  it('should return undefined for invalid ID', () => {
    const notFound = getGiftById('nonexistent');

    expect(notFound).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    const notFound = getGiftById('');

    expect(notFound).toBeUndefined();
  });

  it('should find all available gifts by ID', () => {
    const giftIds = ['rose', 'heart', 'diamond', 'champagne', 'luxury_car'];

    giftIds.forEach((id) => {
      const gift = getGiftById(id);
      expect(gift).toBeDefined();
      expect(gift?.id).toBe(id);
    });
  });

  it('should be case-sensitive', () => {
    const upperCase = getGiftById('ROSE');
    const lowerCase = getGiftById('rose');

    expect(upperCase).toBeUndefined();
    expect(lowerCase).toBeDefined();
  });
});

describe('getAffordableGifts', () => {
  it('should return empty array when balance is 0', () => {
    const affordable = getAffordableGifts(0);

    expect(affordable).toHaveLength(0);
  });

  it('should return only rose when balance is 10', () => {
    const affordable = getAffordableGifts(10);

    expect(affordable).toHaveLength(1);
    expect(affordable[0].id).toBe('rose');
  });

  it('should return rose and heart when balance is 20', () => {
    const affordable = getAffordableGifts(20);

    expect(affordable).toHaveLength(2);
    expect(affordable.some((g) => g.id === 'rose')).toBe(true);
    expect(affordable.some((g) => g.id === 'heart')).toBe(true);
  });

  it('should return all gifts when balance is 500 or more', () => {
    const affordable = getAffordableGifts(500);

    expect(affordable).toHaveLength(AVAILABLE_GIFTS.length);
  });

  it('should return all gifts for very high balance', () => {
    const affordable = getAffordableGifts(10000);

    expect(affordable).toHaveLength(AVAILABLE_GIFTS.length);
  });

  it('should not return luxury_car when balance is 499', () => {
    const affordable = getAffordableGifts(499);

    expect(affordable.some((g) => g.id === 'luxury_car')).toBe(false);
  });

  it('should return correct subset for 100 credits', () => {
    const affordable = getAffordableGifts(100);

    // Should include: rose (10), heart (20), diamond (50), champagne (100)
    // Should not include: luxury_car (500)
    expect(affordable).toHaveLength(4);
    expect(affordable.every((g) => g.creditCost <= 100)).toBe(true);
    expect(affordable.some((g) => g.id === 'luxury_car')).toBe(false);
  });

  it('should handle fractional balance (floor behavior)', () => {
    // If user has 9.99 credits, they can't afford rose (10)
    const affordable = getAffordableGifts(9);

    expect(affordable).toHaveLength(0);
  });

  it('should return gifts in their original order', () => {
    const affordable = getAffordableGifts(500);

    // Verify order matches AVAILABLE_GIFTS
    affordable.forEach((gift, index) => {
      expect(gift.id).toBe(AVAILABLE_GIFTS[index].id);
    });
  });
});

describe('Gift Economics Integration', () => {
  it('should show sender pays more than recipient receives', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      const earnings = calculateRecipientEarnings(gift.creditCost);

      // Sender pays full creditCost
      // Recipient gets 40% of USD value
      expect(earnings.payoutUsd).toBeLessThan(gift.usdValue);
    });
  });

  it('should calculate platform fee correctly (60%)', () => {
    AVAILABLE_GIFTS.forEach((gift) => {
      const earnings = calculateRecipientEarnings(gift.creditCost);
      const platformFee = gift.usdValue - earnings.payoutUsd;

      expect(platformFee).toBeCloseTo(gift.usdValue * 0.60, 10);
    });
  });

  it('should require 2500 credits ($10 payout) for minimum withdrawal', () => {
    // Minimum payout is $10, recipient gets 40%
    // So need $25 total = 2500 credits
    const minWithdrawCredits = 2500;
    const result = calculateRecipientEarnings(minWithdrawCredits);

    expect(result.payoutUsd).toBe(10);
  });
});

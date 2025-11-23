import { describe, it, expect } from 'vitest';
import {
  PLACEHOLDER_AVATARS,
  PROFILES,
  GIFTS,
  CREDIT_PACKAGES,
  SUBSCRIPTION_PLANS,
  ACHIEVEMENTS,
} from '../constants';

describe('PLACEHOLDER_AVATARS', () => {
  it('should have at least one placeholder avatar', () => {
    expect(PLACEHOLDER_AVATARS.length).toBeGreaterThan(0);
  });

  it('should contain valid URLs', () => {
    PLACEHOLDER_AVATARS.forEach((url) => {
      expect(url).toMatch(/^https?:\/\//);
    });
  });

  it('should have unique URLs', () => {
    const uniqueUrls = new Set(PLACEHOLDER_AVATARS);
    expect(uniqueUrls.size).toBe(PLACEHOLDER_AVATARS.length);
  });
});

describe('PROFILES (mock data)', () => {
  it('should have at least one profile', () => {
    expect(PROFILES.length).toBeGreaterThan(0);
  });

  it('should have required fields for each profile', () => {
    PROFILES.forEach((profile) => {
      expect(profile.id).toBeTruthy();
      expect(profile.name).toBeTruthy();
      expect(typeof profile.age).toBe('number');
      expect(profile.imageUrl).toBeTruthy();
      expect(profile.occupation).toBeTruthy();
      expect(profile.bio).toBeTruthy();
      expect(Array.isArray(profile.interests)).toBe(true);
      expect(Array.isArray(profile.hobbies)).toBe(true);
      expect(profile.country).toBeTruthy();
    });
  });

  it('should have unique IDs', () => {
    const ids = PROFILES.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have reasonable ages (18-100)', () => {
    PROFILES.forEach((profile) => {
      expect(profile.age).toBeGreaterThanOrEqual(18);
      expect(profile.age).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid image URLs', () => {
    PROFILES.forEach((profile) => {
      expect(profile.imageUrl).toMatch(/^https?:\/\//);
    });
  });

  it('should have at least one interest per profile', () => {
    PROFILES.forEach((profile) => {
      expect(profile.interests.length).toBeGreaterThan(0);
    });
  });

  it('should have icebreakers for profiles (optional but recommended)', () => {
    // At least some profiles should have icebreakers
    const profilesWithIcebreakers = PROFILES.filter(
      (p) => p.icebreakers && p.icebreakers.length > 0
    );
    expect(profilesWithIcebreakers.length).toBeGreaterThan(0);
  });
});

describe('GIFTS constant', () => {
  it('should have multiple gifts available', () => {
    expect(GIFTS.length).toBeGreaterThan(0);
  });

  it('should have required fields for each gift', () => {
    GIFTS.forEach((gift) => {
      expect(gift.id).toBeTruthy();
      expect(gift.name).toBeTruthy();
      expect(gift.icon).toBeTruthy();
      expect(typeof gift.cost).toBe('number');
      expect(gift.cost).toBeGreaterThan(0);
    });
  });

  it('should have unique IDs', () => {
    const ids = GIFTS.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have positive costs', () => {
    GIFTS.forEach((gift) => {
      expect(gift.cost).toBeGreaterThan(0);
    });
  });

  it('should have varying price points', () => {
    const costs = GIFTS.map((g) => g.cost);
    const uniqueCosts = new Set(costs);
    expect(uniqueCosts.size).toBeGreaterThan(1);
  });

  it('should include common gift types', () => {
    const giftNames = GIFTS.map((g) => g.name.toLowerCase());

    // Check for at least some common gift types
    const hasFlower = giftNames.some((n) => n.includes('rose') || n.includes('bouquet'));
    const hasHeart = giftNames.some((n) => n.includes('heart'));

    expect(hasFlower || hasHeart).toBe(true);
  });
});

describe('CREDIT_PACKAGES', () => {
  it('should have packages for multiple currencies', () => {
    const currencies = new Set(CREDIT_PACKAGES.map((p) => p.currency));
    expect(currencies.size).toBeGreaterThan(1);
  });

  it('should include USD, EUR, GBP, CZK, PLN, CHF', () => {
    const currencies = new Set(CREDIT_PACKAGES.map((p) => p.currency));

    expect(currencies.has('USD')).toBe(true);
    expect(currencies.has('EUR')).toBe(true);
    expect(currencies.has('GBP')).toBe(true);
    expect(currencies.has('CZK')).toBe(true);
    expect(currencies.has('PLN')).toBe(true);
    expect(currencies.has('CHF')).toBe(true);
  });

  it('should have required fields for each package', () => {
    CREDIT_PACKAGES.forEach((pkg) => {
      expect(pkg.id).toBeTruthy();
      expect(typeof pkg.credits).toBe('number');
      expect(typeof pkg.price).toBe('number');
      expect(pkg.currency).toBeTruthy();
    });
  });

  it('should have unique IDs', () => {
    const ids = CREDIT_PACKAGES.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have positive credits and prices', () => {
    CREDIT_PACKAGES.forEach((pkg) => {
      expect(pkg.credits).toBeGreaterThan(0);
      expect(pkg.price).toBeGreaterThan(0);
    });
  });

  it('should offer better value for larger packages (per currency)', () => {
    const currencies = [...new Set(CREDIT_PACKAGES.map((p) => p.currency))];

    currencies.forEach((currency) => {
      const packagesForCurrency = CREDIT_PACKAGES
        .filter((p) => p.currency === currency)
        .sort((a, b) => a.credits - b.credits);

      if (packagesForCurrency.length > 1) {
        const smallPackage = packagesForCurrency[0];
        const largePackage = packagesForCurrency[packagesForCurrency.length - 1];

        const smallRate = smallPackage.price / smallPackage.credits;
        const largeRate = largePackage.price / largePackage.credits;

        // Larger packages should have lower price per credit
        expect(largeRate).toBeLessThan(smallRate);
      }
    });
  });

  it('should have same credit tiers across currencies', () => {
    const creditAmounts = [...new Set(CREDIT_PACKAGES.map((p) => p.credits))].sort((a, b) => a - b);

    // Should have multiple tiers
    expect(creditAmounts.length).toBeGreaterThan(1);

    // Each currency should have same credit amounts
    const currencies = [...new Set(CREDIT_PACKAGES.map((p) => p.currency))];
    currencies.forEach((currency) => {
      const currencyCredits = CREDIT_PACKAGES
        .filter((p) => p.currency === currency)
        .map((p) => p.credits)
        .sort((a, b) => a - b);

      expect(currencyCredits).toEqual(creditAmounts);
    });
  });
});

describe('SUBSCRIPTION_PLANS', () => {
  it('should have plans for multiple tiers', () => {
    const tiers = new Set(SUBSCRIPTION_PLANS.map((p) => p.tier));
    expect(tiers.size).toBeGreaterThan(1);
  });

  it('should have required fields for each plan', () => {
    SUBSCRIPTION_PLANS.forEach((plan) => {
      expect(plan.id).toBeTruthy();
      expect(plan.tier).toBeTruthy();
      expect(plan.name).toBeTruthy();
      expect(typeof plan.price).toBe('number');
      expect(plan.currency).toBeTruthy();
      expect(plan.duration).toBeTruthy();
      expect(Array.isArray(plan.features)).toBe(true);
    });
  });

  it('should have unique IDs', () => {
    const ids = SUBSCRIPTION_PLANS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have positive prices', () => {
    SUBSCRIPTION_PLANS.forEach((plan) => {
      expect(plan.price).toBeGreaterThan(0);
    });
  });

  it('should have at least one feature per plan', () => {
    SUBSCRIPTION_PLANS.forEach((plan) => {
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });

  it('should have higher tier plans with more features', () => {
    const currencies = [...new Set(SUBSCRIPTION_PLANS.map((p) => p.currency))];

    currencies.forEach((currency) => {
      const plansForCurrency = SUBSCRIPTION_PLANS.filter((p) => p.currency === currency);

      // Group by tier
      const tierPlans: Record<string, typeof plansForCurrency> = {};
      plansForCurrency.forEach((plan) => {
        if (!tierPlans[plan.tier]) tierPlans[plan.tier] = [];
        tierPlans[plan.tier].push(plan);
      });

      // VIP should have more features than basic (if both exist)
      if (tierPlans['vip'] && tierPlans['basic']) {
        const vipFeatures = tierPlans['vip'][0]?.features.length || 0;
        const basicFeatures = tierPlans['basic'][0]?.features.length || 0;
        expect(vipFeatures).toBeGreaterThan(basicFeatures);
      }
    });
  });

  it('should have monthly duration for all plans', () => {
    SUBSCRIPTION_PLANS.forEach((plan) => {
      expect(['monthly', 'yearly']).toContain(plan.duration);
    });
  });
});

describe('ACHIEVEMENTS', () => {
  it('should have multiple achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  it('should have required fields for each achievement', () => {
    ACHIEVEMENTS.forEach((achievement) => {
      expect(achievement.id).toBeTruthy();
      expect(achievement.name).toBeTruthy();
      expect(achievement.description).toBeTruthy();
      expect(achievement.icon).toBeTruthy();
      expect(achievement.category).toBeTruthy();
    });
  });

  it('should have unique IDs', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid categories', () => {
    const validCategories = ['social', 'engagement', 'streak', 'special'];

    ACHIEVEMENTS.forEach((achievement) => {
      expect(validCategories).toContain(achievement.category);
    });
  });

  it('should have achievements in each category', () => {
    const categories = new Set(ACHIEVEMENTS.map((a) => a.category));

    expect(categories.has('social')).toBe(true);
    expect(categories.has('engagement')).toBe(true);
    expect(categories.has('streak')).toBe(true);
    expect(categories.has('special')).toBe(true);
  });

  it('should have positive targets for achievements with targets', () => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (achievement.target !== undefined) {
        expect(achievement.target).toBeGreaterThan(0);
      }
    });
  });

  it('should have streak achievements with increasing targets', () => {
    const streakAchievements = ACHIEVEMENTS
      .filter((a) => a.category === 'streak' && a.target !== undefined)
      .sort((a, b) => (a.target || 0) - (b.target || 0));

    if (streakAchievements.length > 1) {
      for (let i = 1; i < streakAchievements.length; i++) {
        expect(streakAchievements[i].target).toBeGreaterThan(
          streakAchievements[i - 1].target || 0
        );
      }
    }
  });

  it('should have emoji icons', () => {
    ACHIEVEMENTS.forEach((achievement) => {
      expect(achievement.icon.length).toBeGreaterThan(0);
    });
  });
});

describe('Data Integrity Across Constants', () => {
  it('should have consistent credit values between GIFTS and packages', () => {
    // Verify that gift costs are reasonable relative to package sizes
    const minPackageCredits = Math.min(...CREDIT_PACKAGES.map((p) => p.credits));
    const maxGiftCost = Math.max(...GIFTS.map((g) => g.cost));

    // Users should be able to buy at least one gift with smallest package
    expect(minPackageCredits).toBeGreaterThanOrEqual(GIFTS[0]?.cost || 0);
  });

  it('should have no duplicate IDs across all constants', () => {
    const allIds = [
      ...PROFILES.map((p) => p.id),
      ...GIFTS.map((g) => g.id),
      ...CREDIT_PACKAGES.map((p) => p.id),
      ...SUBSCRIPTION_PLANS.map((p) => p.id),
      ...ACHIEVEMENTS.map((a) => a.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });
});

// Gift System - Virtual Gifts that can be sent in chat
// Based on CREDITS_AND_PAYOUTS.md economic model

export interface Gift {
  id: string;
  name: string;
  icon: string;
  creditCost: number;
  usdValue: number; // 100 credits = $1 USD
  category: 'basic' | 'premium' | 'luxury';
  description: string;
}

export const AVAILABLE_GIFTS: Gift[] = [
  {
    id: 'rose',
    name: 'Růže',
    icon: '🌹',
    creditCost: 10,
    usdValue: 0.10,
    category: 'basic',
    description: 'Krásná růže pro tvého oblíbence',
  },
  {
    id: 'heart',
    name: 'Srdce',
    icon: '❤️',
    creditCost: 20,
    usdValue: 0.20,
    category: 'basic',
    description: 'Ukaž své city',
  },
  {
    id: 'diamond',
    name: 'Diamant',
    icon: '💎',
    creditCost: 50,
    usdValue: 0.50,
    category: 'premium',
    description: 'Vzácný drahokam',
  },
  {
    id: 'champagne',
    name: 'Šampaňské',
    icon: '🍾',
    creditCost: 100,
    usdValue: 1.00,
    category: 'premium',
    description: 'Oslavte společně',
  },
  {
    id: 'luxury_car',
    name: 'Luxusní Auto',
    icon: '🏎️',
    creditCost: 500,
    usdValue: 5.00,
    category: 'luxury',
    description: 'Ultimátní projev obdivu',
  },
];

// Gift categories for filtering
export const GIFT_CATEGORIES = {
  basic: { label: 'Základní', min: 0, max: 30 },
  premium: { label: 'Premium', min: 31, max: 150 },
  luxury: { label: 'Luxusní', min: 151, max: 1000 },
} as const;

// Calculate recipient earnings (40% payout rate)
export function calculateRecipientEarnings(creditCost: number) {
  const CREDITS_PER_USD = 100;
  const USER_PAYOUT_RATE = 0.40;

  const totalUsd = creditCost / CREDITS_PER_USD;
  const recipientEarningsUsd = totalUsd * USER_PAYOUT_RATE;

  return {
    credits: creditCost,
    usdValue: totalUsd,
    payoutUsd: recipientEarningsUsd,
  };
}

// Get gift by ID
export function getGiftById(giftId: string): Gift | undefined {
  return AVAILABLE_GIFTS.find(gift => gift.id === giftId);
}

// Filter gifts by affordability
export function getAffordableGifts(userBalance: number): Gift[] {
  return AVAILABLE_GIFTS.filter(gift => gift.creditCost <= userBalance);
}

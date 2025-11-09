// Payout Service - API calls to request-payout Edge Function

import { supabase } from './supabase';

export interface PayoutRequest {
  currency: string;
  paymentMethod: 'paypal' | 'bank_account';
  paymentDetails: PayPalDetails | BankAccountDetails;
}

export interface PayPalDetails {
  email: string;
}

export interface BankAccountDetails {
  accountHolderName: string;
  iban?: string; // For SEPA (Europe)
  routingNumber?: string; // For ACH (US)
  accountNumber?: string; // For ACH (US)
  bankName?: string;
  swiftCode?: string; // For international
}

export interface PayoutResponse {
  payoutRequestId: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  message: string;
  estimatedArrival?: string;
}

export interface UserBalance {
  balance: number;
  earned_credits: number;
  purchased_credits: number;
  cash_balance_usd: number;
  lifetime_earnings_usd: number;
  lifetime_spent_credits: number;
}

export interface PayoutHistoryItem {
  id: string;
  created_at: string;
  amount_usd: number;
  payout_amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'failed';
  processed_at?: string;
  notes?: string;
}

export const MIN_PAYOUT_USD = 10.0;
export const PLATFORM_COMMISSION_RATE = 0.60;

/**
 * Request a payout via Edge Function
 * Requires authentication and minimum $10 USD balance
 */
export async function requestPayout(
  request: PayoutRequest
): Promise<PayoutResponse> {
  // Get auth session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error('Musíte být přihlášeni pro žádost o výplatu');
  }

  // Call Edge Function
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/request-payout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Nepodařilo se vytvořit žádost o výplatu');
  }

  const data: PayoutResponse = await response.json();
  return data;
}

/**
 * Fetch user's credit balance and earnings
 */
export async function getUserBalance(): Promise<UserBalance> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // If user has no credits record yet, return defaults
    if (error.code === 'PGRST116') {
      return {
        balance: 0,
        earned_credits: 0,
        purchased_credits: 0,
        cash_balance_usd: 0,
        lifetime_earnings_usd: 0,
        lifetime_spent_credits: 0,
      };
    }
    throw error;
  }

  return {
    balance: data.balance || 0,
    earned_credits: data.earned_credits || 0,
    purchased_credits: data.purchased_credits || 0,
    cash_balance_usd: parseFloat(data.cash_balance_usd || '0'),
    lifetime_earnings_usd: parseFloat(data.lifetime_earnings_usd || '0'),
    lifetime_spent_credits: data.lifetime_spent_credits || 0,
  };
}

/**
 * Fetch user's payout history
 */
export async function getPayoutHistory(): Promise<PayoutHistoryItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('payout_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payout history:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    created_at: item.created_at,
    amount_usd: parseFloat(item.amount_usd),
    payout_amount: parseFloat(item.payout_amount),
    currency: item.currency,
    payment_method: item.payment_method,
    status: item.status,
    processed_at: item.processed_at,
    notes: item.admin_notes,
  }));
}

/**
 * Get available payout currencies with exchange rates
 */
export async function getPayoutCurrencies() {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .order('currency_code');

  if (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }

  return data.map((rate) => ({
    code: rate.currency_code,
    symbol: rate.symbol,
    rateToUsd: parseFloat(rate.rate_to_usd),
    country: rate.country_code,
    notes: rate.notes,
  }));
}

/**
 * Calculate payout amount after commission
 */
export function calculatePayoutAmount(cashBalanceUsd: number, currency: string, rateToUsd: number) {
  // Cash balance is already post-commission (40% of gift value)
  const payoutInTargetCurrency = cashBalanceUsd / rateToUsd;

  return {
    amountUsd: cashBalanceUsd,
    amountInCurrency: payoutInTargetCurrency,
    platformCommission: 0, // Already deducted when gift was received
    userReceives: payoutInTargetCurrency,
  };
}

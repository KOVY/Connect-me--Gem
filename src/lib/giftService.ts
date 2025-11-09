// Gift Service - API calls to send-gift Edge Function

import { supabase } from './supabase';

export interface SendGiftRequest {
  recipientId: string;
  giftId: string;
  creditCost: number;
}

export interface SendGiftResponse {
  success: boolean;
  transactionId: string;
  senderNewBalance: number;
  recipientEarned: {
    credits: number;
    usd: number;
  };
}

export interface SendGiftError {
  error: string;
}

/**
 * Send a gift to another user via Edge Function
 * Requires authentication
 */
export async function sendGift(
  request: SendGiftRequest
): Promise<SendGiftResponse> {
  // Get auth session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error('Musíte být přihlášeni pro posílání dárků');
  }

  // Call Edge Function
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/send-gift`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        recipientId: request.recipientId,
        giftId: request.giftId,
        creditCost: request.creditCost,
      }),
    }
  );

  if (!response.ok) {
    const errorData: SendGiftError = await response.json();
    throw new Error(errorData.error || 'Nepodařilo se poslat dárek');
  }

  const data: SendGiftResponse = await response.json();
  return data;
}

/**
 * Fetch user's current credit balance
 */
export async function getUserCreditBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching credit balance:', error);
    return 0;
  }

  return data?.balance || 0;
}

/**
 * Refresh user's credit balance from database
 */
export async function refreshCreditBalance(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  return getUserCreditBalance(user.id);
}

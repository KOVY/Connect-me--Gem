// Supabase Edge Function: Send Gift
// Deducts credits from sender, adds earned_credits to recipient

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Credit value conversion: 100 credits = $1 USD
const CREDITS_PER_USD = 100;
const USER_PAYOUT_RATE = 0.40; // 40% to user, 60% to platform

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user (sender)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Parse request
    const {
      recipientId,
      giftId,
      creditCost,
    }: {
      recipientId: string;
      giftId: string;
      creditCost: number;
    } = await req.json();

    if (!recipientId || !giftId || !creditCost) {
      throw new Error('Missing required fields');
    }

    // Use admin client for transaction (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Start transaction-like operations
    // 1. Check sender has enough credits
    const { data: senderCredits, error: senderError } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (senderError || !senderCredits) {
      throw new Error('Sender credit account not found');
    }

    if ((senderCredits.balance || 0) < creditCost) {
      throw new Error('Insufficient credits');
    }

    // 2. Deduct from sender
    const newSenderBalance = (senderCredits.balance || 0) - creditCost;
    const { error: deductError } = await supabaseAdmin
      .from('credits')
      .update({
        balance: newSenderBalance,
        lifetime_spent_credits: (senderCredits.lifetime_spent_credits || 0) + creditCost,
      })
      .eq('user_id', user.id);

    if (deductError) throw deductError;

    // 3. Calculate recipient earnings (40% of credit value)
    const creditValueUsd = creditCost / CREDITS_PER_USD;
    const recipientEarningsUsd = creditValueUsd * USER_PAYOUT_RATE;

    // 4. Get or create recipient credits
    const { data: recipientCredits, error: recipientFetchError } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('user_id', recipientId)
      .single();

    if (recipientFetchError && recipientFetchError.code !== 'PGRST116') {
      throw recipientFetchError;
    }

    if (recipientCredits) {
      // Update existing
      const { error: updateError } = await supabaseAdmin
        .from('credits')
        .update({
          earned_credits: (recipientCredits.earned_credits || 0) + creditCost,
          balance: (recipientCredits.balance || 0) + creditCost,
          cash_balance_usd: (recipientCredits.cash_balance_usd || 0) + recipientEarningsUsd,
          lifetime_earnings_usd: (recipientCredits.lifetime_earnings_usd || 0) + recipientEarningsUsd,
        })
        .eq('user_id', recipientId);

      if (updateError) throw updateError;
    } else {
      // Create new
      const { error: insertError } = await supabaseAdmin
        .from('credits')
        .insert({
          user_id: recipientId,
          earned_credits: creditCost,
          purchased_credits: 0,
          balance: creditCost,
          cash_balance_usd: recipientEarningsUsd,
          lifetime_earnings_usd: recipientEarningsUsd,
        });

      if (insertError) throw insertError;
    }

    // 5. Create transaction record
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        recipient_user_id: recipientId,
        type: 'gift_sent',
        amount: creditValueUsd,
        currency: 'USD',
        status: 'completed',
        gift_id: giftId,
        credit_amount: creditCost,
      })
      .select()
      .single();

    if (txError) throw txError;

    // 6. Send notification to recipient
    await supabaseAdmin.from('notifications').insert({
      user_id: recipientId,
      type: 'gift_received',
      title: `You received a gift!`,
      message: `You earned ${recipientEarningsUsd.toFixed(2)} USD from a gift`,
      data: {
        sender_id: user.id,
        gift_id: giftId,
        credit_cost: creditCost,
        earned_usd: recipientEarningsUsd,
        transaction_id: transaction.id,
      },
      is_admin: false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transaction.id,
        senderNewBalance: newSenderBalance,
        recipientEarned: {
          credits: creditCost,
          usd: recipientEarningsUsd,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending gift:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send gift',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

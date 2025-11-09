// Supabase Edge Function: Request Payout
// Creates payout request with 60% commission

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIN_PAYOUT_USD = 10.00;
const PLATFORM_COMMISSION_RATE = 0.60;

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

    // Get authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Parse request
    const {
      currency,
      paymentMethod,
      paymentDetails,
    }: {
      currency: string;
      paymentMethod: 'bank_account' | 'paypal';
      paymentDetails: {
        email?: string;
        iban?: string;
        accountNumber?: string;
        routingNumber?: string;
      };
    } = await req.json();

    if (!currency || !paymentMethod || !paymentDetails) {
      throw new Error('Missing required fields');
    }

    // Use admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's credits
    const { data: credits, error: creditsError } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits) {
      throw new Error('Credit account not found');
    }

    const cashBalanceUsd = credits.cash_balance_usd || 0;

    // Validate minimum payout
    if (cashBalanceUsd < MIN_PAYOUT_USD) {
      throw new Error(
        `Minimum payout is $${MIN_PAYOUT_USD}. You have $${cashBalanceUsd.toFixed(2)}.`
      );
    }

    // Get exchange rate
    const { data: exchangeRate, error: rateError } = await supabaseAdmin
      .from('exchange_rates')
      .select('*')
      .eq('currency', currency)
      .eq('is_active', true)
      .single();

    if (rateError || !exchangeRate) {
      throw new Error(`Exchange rate for ${currency} not found`);
    }

    // Calculate payout amount
    const amountUsd = cashBalanceUsd;
    const amountAfterCommission = amountUsd; // Already has commission deducted when earned
    const payoutAmount = amountAfterCommission / exchangeRate.rate_to_usd;

    // Check for existing pending payouts
    const { data: existingPayout } = await supabaseAdmin
      .from('payout_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingPayout) {
      throw new Error('You already have a pending payout request');
    }

    // Create payout request
    const { data: payoutRequest, error: insertError } = await supabaseAdmin
      .from('payout_requests')
      .insert({
        user_id: user.id,
        amount_usd: amountUsd,
        amount_after_commission: amountAfterCommission,
        commission_rate: PLATFORM_COMMISSION_RATE,
        currency: currency,
        payout_amount: payoutAmount,
        status: 'pending',
        payment_method: paymentMethod,
        payment_details: paymentDetails, // TODO: Encrypt in production
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create audit entry
    await supabaseAdmin.from('payout_history').insert({
      payout_request_id: payoutRequest.id,
      user_id: user.id,
      event_type: 'created',
      details: {
        amount_usd: amountUsd,
        currency,
        payment_method: paymentMethod,
      },
    });

    // TODO: Send notification to admin for review
    // TODO: If auto-approved, initiate Stripe payout

    return new Response(
      JSON.stringify({
        success: true,
        payoutRequestId: payoutRequest.id,
        amountUsd: amountUsd,
        payoutAmount: payoutAmount,
        currency: currency,
        status: 'pending',
        message: 'Payout request submitted successfully. It will be reviewed within 1-3 business days.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error requesting payout:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to request payout',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

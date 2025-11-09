// Supabase Edge Function: Create Stripe Checkout Session
// Deno Deploy environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase client
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

    // Parse request body
    const {
      packageId,
      creditAmount,
      price,
      currency,
    }: {
      packageId: string;
      creditAmount: number;
      price: number;
      currency: string;
    } = await req.json();

    // Validate input
    if (!packageId || !creditAmount || !price || !currency) {
      throw new Error('Missing required fields');
    }

    // Get user email from auth
    const userEmail = user.email;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `${creditAmount} Credits`,
              description: `Credit package for AURA dating app`,
              images: ['https://your-domain.com/credit-icon.png'], // TODO: Replace with actual image
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_URL')}/profile/me/shop?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${Deno.env.get('APP_URL')}/profile/me/shop?payment=cancelled`,
      client_reference_id: user.id, // Link to our user
      metadata: {
        userId: user.id,
        packageId,
        creditAmount: creditAmount.toString(),
        currency,
      },
    });

    // Log transaction attempt
    await supabaseClient.from('transactions').insert({
      user_id: user.id,
      type: 'credit_purchase',
      amount: price,
      currency,
      stripe_payment_intent_id: session.id,
      status: 'pending',
      credit_amount: creditAmount,
    });

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

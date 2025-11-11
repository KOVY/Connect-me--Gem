// Supabase Edge Function: Buy Gift Directly (Pay-per-Gift for FREE users)
// Allows users to purchase a single gift without buying credit packs
// Deno Deploy environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gift pricing in real money (based on credit cost)
// Formula: credit_cost * $0.01 (1 credit = $0.01)
const GIFT_PRICING = {
  'gift_1': { credits: 50, price: 0.99, name: 'Rose 🌹' },
  'gift_2': { credits: 150, price: 1.99, name: 'Teddy Bear 🧸' },
  'gift_3': { credits: 75, price: 0.99, name: 'Chocolate Box 🍫' },
  'gift_4': { credits: 200, price: 2.49, name: 'Champagne 🍾' },
  'gift_5': { credits: 500, price: 4.99, name: 'Diamond Ring 💍' },
  'gift_6': { credits: 100, price: 1.49, name: 'Bouquet 💐' },
  'gift_7': { credits: 30, price: 0.49, name: 'Heart ❤️' },
  'gift_8': { credits: 120, price: 1.49, name: 'Star ⭐' },
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
      giftId,
      recipientId,
      recipientName,
      currency = 'USD',
    }: {
      giftId: string;
      recipientId: string;
      recipientName: string;
      currency?: string;
    } = await req.json();

    // Validate input
    if (!giftId || !recipientId) {
      throw new Error('Missing required fields: giftId, recipientId');
    }

    // Get gift pricing
    const giftPricing = GIFT_PRICING[giftId as keyof typeof GIFT_PRICING];
    if (!giftPricing) {
      throw new Error('Invalid gift ID');
    }

    // Currency conversion (simple version, ideally use real exchange rates)
    const currencyMultipliers: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      CZK: 23,
      PLN: 4,
      CHF: 0.88,
    };

    const multiplier = currencyMultipliers[currency] || 1;
    const localPrice = giftPricing.price * multiplier;

    // Create Stripe Checkout Session for direct gift purchase
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Send ${giftPricing.name} to ${recipientName}`,
              description: `Direct gift purchase - no credits needed!`,
              images: ['https://your-domain.com/gift-icon.png'], // TODO: Replace
            },
            unit_amount: Math.round(localPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_URL')}/chat/${recipientId}?gift_sent=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('APP_URL')}/chat/${recipientId}?gift_purchase=cancelled`,
      client_reference_id: user.id,
      metadata: {
        type: 'direct_gift_purchase',
        senderId: user.id,
        recipientId,
        giftId,
        creditValue: giftPricing.credits.toString(),
        currency,
      },
    });

    // Log transaction (pending until webhook confirms)
    await supabaseClient.from('transactions').insert({
      user_id: user.id,
      type: 'gift_sent',
      amount: localPrice,
      currency,
      credits_change: 0, // No credits involved in direct purchase
      description: `Direct purchase: ${giftPricing.name} for ${recipientName}`,
      stripe_payment_intent_id: null, // Will be updated by webhook
      stripe_session_id: session.id,
      status: 'pending',
      metadata: {
        giftId,
        recipientId,
        recipientName,
        isPurchase: true, // Indicates it's a direct purchase, not credit-based
      },
    });

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        giftName: giftPricing.name,
        price: localPrice,
        currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating direct gift purchase session:', error);

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

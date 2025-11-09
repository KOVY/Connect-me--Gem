// Supabase Edge Function: Stripe Webhook Handler
// Handles payment confirmations and updates user credits

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Webhook signature missing', { status: 400 });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get raw body for signature verification
    const body = await req.text();

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // Initialize Supabase Admin client (bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const creditAmount = parseInt(session.metadata?.creditAmount || '0');
        const currency = session.metadata?.currency;

        if (!userId || !creditAmount) {
          throw new Error('Missing metadata in session');
        }

        console.log(`Processing payment for user ${userId}: ${creditAmount} credits`);

        // Update user credits
        const { data: existingCredits, error: fetchError } = await supabaseAdmin
          .from('credits')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingCredits) {
          // Update existing record
          const { error: updateError } = await supabaseAdmin
            .from('credits')
            .update({
              purchased_credits: (existingCredits.purchased_credits || 0) + creditAmount,
              balance: (existingCredits.balance || 0) + creditAmount,
              total_earned: (existingCredits.total_earned || 0) + creditAmount,
            })
            .eq('user_id', userId);

          if (updateError) throw updateError;
        } else {
          // Create new record
          const { error: insertError } = await supabaseAdmin
            .from('credits')
            .insert({
              user_id: userId,
              purchased_credits: creditAmount,
              balance: creditAmount,
              total_earned: creditAmount,
              earned_credits: 0,
              cash_balance_usd: 0,
            });

          if (insertError) throw insertError;
        }

        // Update transaction status
        const { error: txError } = await supabaseAdmin
          .from('transactions')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('stripe_payment_intent_id', session.id);

        if (txError) {
          console.error('Error updating transaction:', txError);
        }

        console.log(`✅ Successfully added ${creditAmount} credits to user ${userId}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Mark transaction as failed
        const { error } = await supabaseAdmin
          .from('transactions')
          .update({
            status: 'failed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error marking transaction as failed:', error);
        }

        console.log(`❌ Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Webhook handler failed',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

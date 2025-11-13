import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// Allowed tiers for validation
const ALLOWED_TIERS = ['premium', 'vip'] as const
type AllowedTier = typeof ALLOWED_TIERS[number]

// Audit log function
async function auditLog(
  supabase: any,
  action: string,
  userId: string | null,
  details: Record<string, any>,
  status: 'success' | 'error'
) {
  try {
    await supabase.from('audit_logs').insert({
      action,
      user_id: userId,
      details,
      status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Don't fail webhook if audit log fails
    console.error('[Audit] Failed to log:', error instanceof Error ? error.message : 'Unknown')
  }
}

serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!stripeKey || !webhookSecret) {
    console.error('[Webhook] Missing configuration')
    return new Response('Configuration error', { status: 500 })
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  })

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Log event type only (no sensitive data)
    console.log('[Webhook] Event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Validate required metadata
      const userId = session.metadata?.user_id
      const tier = session.metadata?.tier
      const billingPeriod = session.metadata?.billing_period

      if (!userId || !tier || !billingPeriod) {
        console.error('[Webhook] Missing required metadata')
        await auditLog(supabase, 'upgrade_tier', null, { error: 'missing_metadata' }, 'error')
        return new Response('Invalid metadata', { status: 400 })
      }

      // Validate tier is allowed
      if (!ALLOWED_TIERS.includes(tier as AllowedTier)) {
        console.error('[Webhook] Invalid tier:', tier)
        await auditLog(supabase, 'upgrade_tier', userId, { error: 'invalid_tier', tier }, 'error')
        return new Response('Invalid tier', { status: 400 })
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(userId)) {
        console.error('[Webhook] Invalid user ID format')
        await auditLog(supabase, 'upgrade_tier', null, { error: 'invalid_user_id' }, 'error')
        return new Response('Invalid user ID', { status: 400 })
      }

      // Validate billing period
      if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
        console.error('[Webhook] Invalid billing period:', billingPeriod)
        await auditLog(supabase, 'upgrade_tier', userId, { error: 'invalid_billing_period' }, 'error')
        return new Response('Invalid billing period', { status: 400 })
      }

      const durationMonths = billingPeriod === 'yearly' ? 12 : 1

      // Execute upgrade with validated data
      const { error: upgradeError } = await supabase.rpc('upgrade_user_tier', {
        p_user_id: userId,
        p_new_tier: tier,
        p_stripe_customer_id: session.customer as string,
        p_stripe_subscription_id: session.subscription as string,
        p_duration_months: durationMonths,
      })

      if (upgradeError) {
        console.error('[Webhook] Upgrade failed:', upgradeError.message)
        await auditLog(supabase, 'upgrade_tier', userId, {
          tier,
          billing_period: billingPeriod,
          error: upgradeError.message,
        }, 'error')
        return new Response('Upgrade failed', { status: 500 })
      }

      // Audit log success
      await auditLog(supabase, 'upgrade_tier', userId, {
        tier,
        billing_period: billingPeriod,
        duration_months: durationMonths,
      }, 'success')

      console.log('[Webhook] Upgrade successful for user:', userId)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Don't expose internal error details
    console.error('[Webhook] Error:', error instanceof Error ? error.message : 'Unknown')
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

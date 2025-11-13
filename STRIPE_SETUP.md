# Stripe Payment Integration Setup

## 1. Stripe Dashboard Setup

### Create Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create 4 products:

**Premium Monthly**
- Name: "Premium Monthly"
- Price: €9.99/month
- Recurring
- Copy Price ID → `price_xxx`

**Premium Yearly**
- Name: "Premium Yearly"
- Price: €99.99/year
- Recurring
- Copy Price ID → `price_xxx`

**VIP Monthly**
- Name: "VIP Monthly"
- Price: €29.99/month
- Recurring
- Copy Price ID → `price_xxx`

**VIP Yearly**
- Name: "VIP Yearly"
- Price: €299.99/year
- Recurring
- Copy Price ID → `price_xxx`

### Create Webhook

1. Go to Developers → Webhooks
2. Add endpoint: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy Webhook Signing Secret → `whsec_xxx`

## 2. Environment Variables

### Vercel Dashboard

Add these variables:

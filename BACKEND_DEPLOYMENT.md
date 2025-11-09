# 🚀 Backend Deployment Guide

Complete guide for deploying Supabase Edge Functions and Stripe integration.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project created
- [ ] Stripe account (https://dashboard.stripe.com)
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Git repository cloned
- [ ] All SQL migrations run (001-007)

---

## 1️⃣ Set Up Stripe

### **Create Stripe Account**

1. Go to https://dashboard.stripe.com/register
2. Complete verification
3. Enable "Test mode" for development

### **Get API Keys**

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

### **Create Webhook Endpoint**

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://[YOUR_PROJECT_REF].supabase.co/functions/v1/stripe-webhook`
   - Replace `[YOUR_PROJECT_REF]` with your Supabase project ref
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy **Signing secret** (starts with `whsec_`)

---

## 2️⃣ Configure Environment Variables

### **Add to Supabase Dashboard**

1. Go to https://app.supabase.com/project/[PROJECT_REF]/settings/functions
2. Add these secrets:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
APP_URL=http://localhost:3000  # Change to production URL later

# Supabase (automatically available)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Only for admin functions
```

### **Add to Frontend `.env`**

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 3️⃣ Deploy Edge Functions

### **Login to Supabase**

```bash
npx supabase login
```

### **Link Project**

```bash
npx supabase link --project-ref [YOUR_PROJECT_REF]
```

### **Deploy Functions**

Deploy all 4 functions:

```bash
# Deploy create-checkout-session
npx supabase functions deploy create-checkout-session

# Deploy stripe-webhook
npx supabase functions deploy stripe-webhook

# Deploy send-gift
npx supabase functions deploy send-gift

# Deploy request-payout
npx supabase functions deploy request-payout
```

### **Verify Deployment**

```bash
npx supabase functions list
```

Expected output:
```
create-checkout-session
stripe-webhook
send-gift
request-payout
```

---

## 4️⃣ Test the Integration

### **Test Credit Purchase**

1. Open app: `http://localhost:3000/profile/me/shop`
2. Click "Buy Now" on any package
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete payment
6. Should redirect back with success
7. Check credits in user profile

### **Test Webhook**

```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### **Test Gift Sending**

```bash
curl -X POST https://[PROJECT_REF].supabase.co/functions/v1/send-gift \
  -H "Authorization: Bearer [USER_AUTH_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "uuid-of-recipient",
    "giftId": "rose",
    "creditCost": 10
  }'
```

Expected response:
```json
{
  "success": true,
  "transactionId": "...",
  "senderNewBalance": 90
}
```

---

## 5️⃣ Production Deployment

### **Update Environment Variables**

```bash
# In Supabase Dashboard
APP_URL=https://your-domain.com

# Use production Stripe keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

### **Update Webhook Endpoint**

1. Go to https://dashboard.stripe.com/webhooks
2. Update endpoint URL to production:
   ```
   https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook
   ```
3. Copy new signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Supabase

### **Re-deploy Functions**

```bash
npx supabase functions deploy --no-verify-jwt create-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-gift
npx supabase functions deploy request-payout
```

---

## 6️⃣ Monitoring & Logs

### **View Function Logs**

```bash
# Real-time logs
npx supabase functions logs create-checkout-session --tail

# Or in dashboard
# https://app.supabase.com/project/[PROJECT_REF]/functions/create-checkout-session/logs
```

### **Monitor Stripe Events**

1. Go to https://dashboard.stripe.com/test/events
2. See all webhook deliveries
3. Check for failed webhooks

### **Common Errors**

**Error: "Unauthorized"**
- Check auth token is valid
- Ensure user is logged in

**Error: "Insufficient credits"**
- User doesn't have enough credits
- Check balance in database

**Error: "Webhook signature verification failed"**
- Wrong `STRIPE_WEBHOOK_SECRET`
- Update secret in Supabase dashboard

---

## 7️⃣ Security Checklist

Before going live:

- [ ] Use production Stripe keys (not test keys)
- [ ] Enable Stripe webhook signature verification
- [ ] Set proper CORS headers in functions
- [ ] Enable RLS on all tables
- [ ] Use `service_role_key` only in Edge Functions (not frontend)
- [ ] Encrypt payment details in `payout_requests` table
- [ ] Enable rate limiting on expensive operations
- [ ] Set up monitoring alerts for failed payments
- [ ] Test payout flow end-to-end
- [ ] Verify commission calculations (60/40 split)

---

## 8️⃣ Backup & Recovery

### **Backup Database**

```bash
# Automated backups are enabled by default in Supabase
# Manual backup:
pg_dump -h db.[PROJECT_REF].supabase.co -U postgres -d postgres > backup.sql
```

### **Restore from Backup**

```bash
psql -h db.[PROJECT_REF].supabase.co -U postgres -d postgres < backup.sql
```

---

## 9️⃣ Cost Estimation

### **Supabase Edge Functions**

- Free tier: 500K requests/month
- Beyond: $2 per 1M requests

### **Stripe Fees**

- **Credit card:** 2.9% + $0.30 per transaction
- **Payouts:** ~$0.25-2% depending on method
- **International cards:** +1%

### **Example Cost Breakdown**

User buys 500 credits for $19.99:
```
Sale price:        $19.99
Stripe fee (2.9%): -$0.58
Stripe fixed fee:  -$0.30
Net to platform:    $19.11
```

User cashes out $10:
```
Gross payout:      $10.00
Platform fee (60%): -$6.00
User receives (40%): $4.00
Stripe payout fee:  -$0.25
Net cost to us:     $3.75
```

**Profit per cycle:** $19.11 - $3.75 = **$15.36** 💰

---

## 🔟 Support & Debugging

### **Enable Debug Mode**

Add to Edge Functions:

```typescript
const DEBUG = Deno.env.get('DEBUG') === 'true';

if (DEBUG) {
  console.log('Debug info:', {user, package, etc});
}
```

### **Test with Stripe CLI**

```bash
# List recent events
stripe events list --limit 10

# Get specific event
stripe events retrieve evt_...

# Resend webhook
stripe events resend evt_...
```

### **Database Queries for Debugging**

```sql
-- Check recent transactions
SELECT * FROM transactions
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check pending payouts
SELECT * FROM payout_requests
WHERE status = 'pending'
ORDER BY requested_at DESC;

-- Check user credits
SELECT user_id, balance, purchased_credits, earned_credits, cash_balance_usd
FROM credits
WHERE user_id = 'uuid-here';
```

---

## 📞 Get Help

- **Supabase Discord:** https://discord.supabase.com
- **Stripe Support:** https://support.stripe.com
- **Documentation:** `/CREDITS_AND_PAYOUTS.md`

---

Made with 💜 by AURA Team

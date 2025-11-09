# Supabase Edge Functions

Backend API endpoints for AURA dating app.

## Functions

### 1. `create-checkout-session`
Creates Stripe Checkout session for credit purchases.

**Endpoint:** `POST /functions/v1/create-checkout-session`

**Auth:** Required (Bearer token)

**Request:**
```json
{
  "packageId": "uuid",
  "creditAmount": 500,
  "price": 19.99,
  "currency": "USD"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

### 2. `stripe-webhook`
Handles Stripe webhook events (payment confirmations).

**Endpoint:** `POST /functions/v1/stripe-webhook`

**Auth:** Stripe signature verification

**Events:**
- `checkout.session.completed` → Add credits to user
- `payment_intent.payment_failed` → Mark transaction as failed

---

### 3. `send-gift`
Send gift from one user to another (deduct credits, add earned credits).

**Endpoint:** `POST /functions/v1/send-gift`

**Auth:** Required

**Request:**
```json
{
  "recipientId": "uuid",
  "giftId": "rose",
  "creditCost": 10
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "senderNewBalance": 90,
  "recipientEarned": {
    "credits": 10,
    "usd": 0.04
  }
}
```

---

### 4. `request-payout`
Request payout of earned credits (60% commission).

**Endpoint:** `POST /functions/v1/request-payout`

**Auth:** Required

**Request:**
```json
{
  "currency": "USD",
  "paymentMethod": "paypal",
  "paymentDetails": {
    "email": "user@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "payoutRequestId": "uuid",
  "amountUsd": 25.00,
  "payoutAmount": 25.00,
  "currency": "USD",
  "status": "pending",
  "message": "Payout request submitted..."
}
```

---

## Deployment

See `/BACKEND_DEPLOYMENT.md` for full instructions.

**Quick deploy:**
```bash
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-gift
npx supabase functions deploy request-payout
```

## Environment Variables

Required in Supabase Dashboard → Settings → Edge Functions:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
```

## Testing

```bash
# Test create checkout
curl -X POST https://[PROJECT_REF].supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"packageId":"...","creditAmount":100,"price":4.99,"currency":"USD"}'

# View logs
npx supabase functions logs create-checkout-session --tail
```

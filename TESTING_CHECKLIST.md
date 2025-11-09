# 🧪 COMPLETE WORKFLOW TESTING CHECKLIST

This checklist covers end-to-end testing of the complete monetization system.

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before testing, ensure you've completed:

- [ ] Followed all steps in `DEPLOYMENT_STEPS.md`
- [ ] All 4 Edge Functions deployed (create-checkout-session, stripe-webhook, send-gift, request-payout)
- [ ] Stripe webhook endpoint created and secret added to Supabase
- [ ] Migration 007 executed successfully
- [ ] All environment variables set in Supabase

---

## 🛒 PART 1: CREDIT PURCHASE FLOW

### Test Case 1.1: Shop Page Display

**URL:** `http://localhost:3000/cs/profile/me/shop`

**Steps:**
1. Navigate to Profile → Shop
2. Verify 4 credit packages are displayed:
   - Starter (100 kreditů, 113 Kč)
   - Popular (500 kreditů, 454 Kč) - 20% sleva badge
   - Best Value (1000 kreditů, 795 Kč) - 30% sleva badge
   - Premium (2500 kreditů, 1704 Kč) - 40% sleva badge
3. Verify current balance is displayed
4. Verify "Cost per credit" calculation is correct

**Expected Result:**
- All packages load from `credit_pricing` table
- Currency matches user's locale (CZK for Czech)
- Discount badges show correctly
- Balance shows 0 credits (for new user)

---

### Test Case 1.2: Stripe Checkout Session

**Steps:**
1. Click "Buy Now" on Starter package (113 Kč)
2. You should be redirected to Stripe Checkout
3. Verify Stripe page shows:
   - Product: "100 Credits"
   - Amount: 113.00 CZK
   - Payment form visible

**Expected Result:**
- Stripe Checkout loads successfully
- Amount matches selected package
- Currency is correct

---

### Test Case 1.3: Test Payment (Success)

**Use Stripe test card:**
```
Card number: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

**Steps:**
1. Fill in payment details with test card
2. Click "Pay"
3. Wait for webhook processing
4. Verify redirect to shop page with success parameter

**Expected Result:**
- Payment succeeds
- Redirected to `/profile/me/shop?session_id=cs_test_...&payment=success`
- Balance updates to 100 credits (may take 2-5 seconds for webhook)

**Database Verification:**
```sql
-- Check credits table
SELECT * FROM public.credits WHERE user_id = '[YOUR_USER_ID]';

-- Should show:
-- purchased_credits: 100
-- balance: 100
-- total_earned: 100

-- Check transactions table
SELECT * FROM public.transactions
WHERE user_id = '[YOUR_USER_ID]'
ORDER BY created_at DESC
LIMIT 1;

-- Should show:
-- type: credit_purchase
-- status: completed
-- credit_amount: 100
```

---

### Test Case 1.4: Test Payment (Declined Card)

**Use Stripe test card:**
```
Card number: 4000 0000 0000 0002
(This card will be declined)
```

**Steps:**
1. Try to purchase with declined card
2. Verify error message

**Expected Result:**
- Payment fails with clear error message
- No credits added to account
- Transaction marked as 'failed' in database

---

## 🎁 PART 2: GIFT SENDING FLOW

### Test Case 2.1: Gift Modal Display

**Prerequisites:** Have at least 50 credits

**Steps:**
1. Navigate to a chat (e.g., click on a profile, go to chat)
2. Click the gift button (🎁 icon) in chat input
3. Verify GiftModal opens

**Expected Result:**
- Modal shows 5 gift options:
  - 🌹 Růže (10 kreditů)
  - ❤️ Srdce (20 kreditů)
  - 💎 Diamant (50 kreditů)
  - 🍾 Šampaňské (100 kreditů)
  - 🏎️ Luxusní Auto (500 kreditů)
- Current balance displayed correctly
- Gifts you can't afford are dimmed with "Nedostatek kreditů"
- Recipient earnings shown (40% of gift value)

---

### Test Case 2.2: Send Affordable Gift

**Prerequisites:** Have at least 50 credits

**Steps:**
1. Open gift modal in chat
2. Select "Diamant" (50 kreditů)
3. Click "Poslat Diamant (50 kreditů)"
4. Wait for processing

**Expected Result:**
- Loading spinner appears
- Success screen shows:
  - 💎 emoji bouncing
  - "Dárek odeslán! 🎉"
  - Your new balance (original - 50)
  - Confetti animation
- Modal auto-closes after 2.5 seconds

**Database Verification:**
```sql
-- Check sender's credits (deducted)
SELECT * FROM public.credits WHERE user_id = '[SENDER_USER_ID]';
-- balance should be decreased by 50

-- Check recipient's credits (earned)
SELECT * FROM public.credits WHERE user_id = '[RECIPIENT_USER_ID]';
-- earned_credits should increase by 50
-- cash_balance_usd should increase by $0.20 (40% of $0.50)

-- Check transaction
SELECT * FROM public.transactions
WHERE user_id = '[SENDER_USER_ID]'
AND type = 'gift_sent'
ORDER BY created_at DESC
LIMIT 1;

-- Should show:
-- type: gift_sent
-- status: completed
-- credit_amount: 50
-- recipient_user_id: [RECIPIENT_USER_ID]
```

---

### Test Case 2.3: Insufficient Credits

**Prerequisites:** Have less than 50 credits (e.g., 20 credits)

**Steps:**
1. Open gift modal
2. Try to select "Diamant" (50 kreditů)
3. Click send

**Expected Result:**
- Error message: "Nemáte dostatek kreditů. Navštivte Shop pro nákup."
- Link to Shop page provided
- No transaction created

---

### Test Case 2.4: Multiple Gifts

**Prerequisites:** Have at least 100 credits

**Steps:**
1. Send "Růže" (10 kreditů)
2. Verify balance decreases
3. Send "Srdce" (20 kreditů)
4. Verify balance decreases again
5. Check recipient's earnings

**Expected Result:**
- Each gift sends successfully
- Balance decreases correctly (100 → 90 → 70)
- Recipient earned_credits: +30
- Recipient cash_balance_usd: +$0.12 (40% of $0.30)

---

## 💰 PART 3: PAYOUT REQUEST FLOW

### Test Case 3.1: Payout Page Display

**Prerequisites:**
- Be logged in
- Have received some gifts (earned_credits > 0)

**URL:** `http://localhost:3000/cs/profile/me/payout`

**Steps:**
1. Navigate to Profile → Payout
2. Verify page displays

**Expected Result:**
- 3 balance cards visible:
  - **K dispozici**: Shows cash_balance_usd
  - **Vydělané**: Shows earned_credits
  - **Celkem**: Shows lifetime_earnings_usd
- Payout form visible
- Currency dropdown populated
- Payment method selection (PayPal / Bankovní účet)

---

### Test Case 3.2: Below Minimum Balance

**Prerequisites:** cash_balance_usd < $10.00

**Steps:**
1. View payout page
2. Verify warning message

**Expected Result:**
- Yellow warning box shows:
  - "Minimální výplata je $10 USD"
  - Current balance displayed
  - Amount needed to reach minimum
- Form is disabled
- "Požádat o výplatu" button is disabled

**How to reach $10:**
- Need 2500 earned_credits ($10 in gift value)
- After 60% commission → $4.00 payout per 1000 credits
- So need ~2500 earned_credits for $10 payout

---

### Test Case 3.3: Request Payout (PayPal)

**Prerequisites:** cash_balance_usd >= $10.00

**Steps:**
1. Select currency: USD
2. Select payment method: PayPal
3. Enter PayPal email: test@example.com
4. Click "Požádat o výplatu"

**Expected Result:**
- Success message: "Žádost byla úspěšně odeslána!"
- Green notification appears
- Form resets
- Payout appears in "Historie výplat" section with status "Čeká na schválení"

**Database Verification:**
```sql
SELECT * FROM public.payout_requests
WHERE user_id = '[YOUR_USER_ID]'
ORDER BY created_at DESC
LIMIT 1;

-- Should show:
-- amount_usd: 10.00 (or your balance)
-- status: pending
-- payment_method: paypal
-- payment_details: {"email": "test@example.com"}
-- currency: USD
```

---

### Test Case 3.4: Request Payout (Bank Account)

**Prerequisites:** cash_balance_usd >= $10.00

**Steps:**
1. Select currency: CZK
2. Select payment method: Bankovní účet
3. Fill in bank details:
   - Jméno: Jan Novák
   - IBAN: CZ6508000000192000145399
   - Název banky: Česká spořitelna
   - SWIFT: GIBACZPX
4. Click "Požádat o výplatu"

**Expected Result:**
- Success message appears
- Payout calculation shows amount in CZK
- Exchange rate displayed (e.g., "1 USD = 22.7273 CZK")
- Request created with status "pending"

---

### Test Case 3.5: Payout History Display

**Prerequisites:** Have created at least one payout request

**Steps:**
1. Scroll to "Historie výplat" section
2. Verify payout requests are listed

**Expected Result:**
- Each payout shows:
  - Icon based on status (✅ completed, ⏰ pending, ❌ rejected)
  - Amount in target currency
  - Date created
  - Status badge (color-coded)
  - Payment method
- Most recent request at the top

---

## 🔄 PART 4: COMPLETE END-TO-END WORKFLOW

### Test Case 4.1: Full User Journey (Alice)

**Scenario:** Alice buys credits, sends gifts, and receives gifts

**Steps:**
1. **Register as Alice**
   - Sign up with email alice@test.com
   - Complete onboarding

2. **Purchase credits**
   - Go to Shop
   - Buy Starter package (100 kreditů, 113 Kč)
   - Verify balance: 100 credits

3. **Send gifts to Bob**
   - Go to Bob's profile/chat
   - Send "Diamant" (50 kreditů)
   - Verify new balance: 50 credits

4. **Check transaction history**
   - Go to Profile → History
   - Verify purchase and gift transactions

**Expected Results:**
- Alice balance: 50 credits
- Alice purchased_credits: 100
- Alice lifetime_spent_credits: 50

---

### Test Case 4.2: Full User Journey (Bob - Recipient)

**Scenario:** Bob receives gifts and requests payout

**Prerequisites:** Alice sent 50-credit gift to Bob (Test Case 4.1)

**Steps:**
1. **Login as Bob**

2. **Check earnings**
   - Go to Profile → Payout
   - Verify earned_credits: 50
   - Verify cash_balance_usd: $0.20

3. **Try to request payout**
   - Should see warning (below $10 minimum)

4. **Receive more gifts** (send from other test accounts or Alice)
   - Need total 2500 earned_credits ($10 payout value)

5. **Request payout**
   - Once balance >= $10
   - Choose PayPal
   - Submit request

6. **Verify payout history**
   - See pending request

**Expected Results:**
- Bob earned_credits: 2500+
- Bob cash_balance_usd: $10.00+
- Payout request created with status: pending

---

## 🐛 ERROR HANDLING TESTS

### Test Case 5.1: Network Errors

**Steps:**
1. Disconnect internet
2. Try to purchase credits
3. Reconnect
4. Try again

**Expected Result:**
- Clear error message when offline
- Retry works when back online

---

### Test Case 5.2: Expired Session

**Steps:**
1. Clear auth tokens
2. Try to send gift

**Expected Result:**
- Error: "Musíte být přihlášeni"
- Redirected to login page

---

### Test Case 5.3: Concurrent Gift Sends

**Steps:**
1. Open 2 browser tabs
2. Try to send gifts from both simultaneously
3. Check balance

**Expected Result:**
- One succeeds, one may fail with "Insufficient credits"
- Final balance is accurate (no double-deduction)

---

## 📊 ADMIN VERIFICATION

### Check Edge Function Logs

**Via CLI:**
```bash
# Check each function's logs
npx supabase functions logs create-checkout-session --tail
npx supabase functions logs stripe-webhook --tail
npx supabase functions logs send-gift --tail
npx supabase functions logs request-payout --tail
```

**Via Dashboard:**
https://app.supabase.com/project/haayvhkovottszzdnzbz/functions/[FUNCTION_NAME]/logs

**Look for:**
- ✅ Successful requests (200 status)
- ❌ Any errors (400, 500 status)
- Webhook signature verification success
- Database updates logged

---

### Check Stripe Dashboard

**URL:** https://dashboard.stripe.com/test/payments

**Verify:**
- All payments appear
- Webhook deliveries successful
- No failed webhooks

---

### Database Integrity Checks

**Run these queries:**

```sql
-- 1. Check all users have credits records
SELECT u.id, u.email, c.balance, c.earned_credits, c.purchased_credits
FROM auth.users u
LEFT JOIN public.credits c ON u.id = c.user_id;

-- 2. Verify balance = purchased_credits + earned_credits - spent_credits
SELECT
  user_id,
  balance,
  purchased_credits + earned_credits - lifetime_spent_credits AS calculated_balance,
  CASE
    WHEN balance = (purchased_credits + earned_credits - lifetime_spent_credits)
    THEN 'OK'
    ELSE 'MISMATCH'
  END AS status
FROM public.credits;

-- 3. Check transaction totals match credit records
SELECT
  c.user_id,
  c.purchased_credits,
  SUM(t.credit_amount) FILTER (WHERE t.type = 'credit_purchase' AND t.status = 'completed') AS total_purchased,
  CASE
    WHEN c.purchased_credits = SUM(t.credit_amount) FILTER (WHERE t.type = 'credit_purchase' AND t.status = 'completed')
    THEN 'OK'
    ELSE 'MISMATCH'
  END AS status
FROM public.credits c
LEFT JOIN public.transactions t ON c.user_id = t.user_id
GROUP BY c.user_id, c.purchased_credits;

-- 4. Check payout requests total <= user cash balance
SELECT
  pr.user_id,
  SUM(pr.amount_usd) AS total_payout_requests,
  c.cash_balance_usd,
  CASE
    WHEN SUM(pr.amount_usd) <= c.cash_balance_usd
    THEN 'OK'
    ELSE 'EXCEEDED'
  END AS status
FROM public.payout_requests pr
JOIN public.credits c ON pr.user_id = c.user_id
WHERE pr.status IN ('pending', 'approved', 'processing')
GROUP BY pr.user_id, c.cash_balance_usd;
```

---

## ✅ FINAL CHECKLIST

Before considering the system production-ready:

### Functionality
- [ ] All credit packages purchase successfully
- [ ] Stripe webhooks process correctly
- [ ] All 5 gift types send successfully
- [ ] Balance updates are accurate
- [ ] Payout requests create successfully
- [ ] Payout history displays correctly
- [ ] Error messages are clear and helpful

### Security
- [ ] API keys are not exposed in frontend
- [ ] Edge Functions require authentication
- [ ] RLS policies prevent unauthorized access
- [ ] Webhook signatures are verified
- [ ] Payment details are encrypted

### Performance
- [ ] Pages load in <2 seconds
- [ ] Webhook processing completes in <5 seconds
- [ ] No database query timeouts
- [ ] Edge Functions respond in <1 second

### User Experience
- [ ] All text is in Czech (for /cs locale)
- [ ] Modals have smooth animations
- [ ] Success messages appear
- [ ] Error states are handled gracefully
- [ ] Loading states show during API calls

### Database
- [ ] All migrations run without errors
- [ ] Foreign key constraints are valid
- [ ] Indexes are in place
- [ ] RLS policies tested
- [ ] No orphaned records

---

## 🚀 PRODUCTION DEPLOYMENT

Once all tests pass:

1. **Switch to Production Stripe Keys**
   - Get production keys from https://dashboard.stripe.com/apikeys
   - Update in Supabase environment variables
   - Update `.env` for VITE_STRIPE_PUBLISHABLE_KEY

2. **Update Webhook Endpoint**
   - Create production webhook in Stripe
   - Use production URL: `https://haayvhkovottszzdnzbz.supabase.co/functions/v1/stripe-webhook`
   - Update STRIPE_WEBHOOK_SECRET in Supabase

3. **Update APP_URL**
   - Change from `http://localhost:3000` to production URL
   - Update in Supabase environment variables

4. **Final Test in Production**
   - Make a small real purchase ($4.99)
   - Send a real gift
   - Verify webhooks work in production

---

## 🆘 TROUBLESHOOTING

### Webhook Not Receiving Events

**Check:**
1. Stripe webhook endpoint URL is correct
2. Webhook secret matches in Supabase env vars
3. Edge function is deployed and active
4. Stripe test mode matches (test keys → test webhooks)

**Debug:**
```bash
# Check webhook function logs
npx supabase functions logs stripe-webhook --tail

# Check Stripe webhook delivery attempts
# https://dashboard.stripe.com/test/webhooks → Your webhook → Recent deliveries
```

---

### Credits Not Adding After Payment

**Check:**
1. Webhook function processed the event (check logs)
2. Transaction status in database (should be 'completed')
3. User ID in Stripe metadata matches auth.users.id

**Fix:**
```bash
# Manually trigger webhook processing via Stripe Dashboard
# Go to Payment → Click "..." → "Resend all webhooks"
```

---

### Gift Send Fails

**Check:**
1. Sender has sufficient balance
2. Recipient user exists in database
3. Edge function has SUPABASE_SERVICE_ROLE_KEY env var

**Debug:**
```bash
npx supabase functions logs send-gift --tail
```

---

### Payout Request Errors

**Check:**
1. User balance >= $10 USD
2. Currency exists in exchange_rates table
3. Payment details are valid
4. Edge function deployed correctly

---

Made with 💜 by AURA Team

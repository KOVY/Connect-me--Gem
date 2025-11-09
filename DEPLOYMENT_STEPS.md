# 🚀 DEPLOYMENT CHECKLIST - Krok za Krokem

Tento dokument tě provede nasazením Edge Functions a Stripe integrace.

---

## ✅ KROK 1: Stripe Account Setup

### 1.1 Vytvoř Stripe účet

1. Jdi na: https://dashboard.stripe.com/register
2. Vyplň email, heslo
3. Ověř email
4. **Zapni Test Mode** (přepínač vpravo nahoře)

### 1.2 Získej API klíče

1. Jdi na: https://dashboard.stripe.com/test/apikeys
2. Zkopíruj **Publishable key** (začíná `pk_test_`)
   ```
   pk_test_51...
   ```
3. Klikni "Reveal test key" pro **Secret key** (začíná `sk_test_`)
   ```
   sk_test_51...
   ```
4. **ULOŽ SI JE NĚKAM!** Budeme je potřebovat

---

## ✅ KROK 2: Přidej Klíče do .env

Otevři soubor `.env` v kořenu projektu a přidej:

```bash
# Stripe Keys (TEST MODE)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# (Secret key přidáme do Supabase později)
```

**Ulož soubor!**

---

## ✅ KROK 3: Nainstaluj Supabase CLI

Otevři terminál:

```bash
# Nainstaluj Supabase CLI globálně
npm install -g supabase

# Ověř instalaci
supabase --version
# Mělo by vrátit: supabase 1.x.x
```

---

## ✅ KROK 4: Login do Supabase

```bash
# Přihlas se
npx supabase login

# Otevře se prohlížeč → přihlas se do Supabase
# Po úspěchu se vrátíš do terminálu
```

---

## ✅ KROK 5: Linkni Projekt

```bash
# Připoj lokální projekt k Supabase
npx supabase link --project-ref haayvhkovottszzdnzbz

# Mělo by vrátit:
# ✓ Finished supabase link.
```

---

## ✅ KROK 6: Přidej Environment Variables do Supabase

1. Jdi na: https://app.supabase.com/project/haayvhkovottszzdnzbz/settings/functions
2. Klikni **"Add new secret"**
3. Přidej tyto 4 secrets (jeden po druhém):

**Secret 1:**
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51... (tvůj secret key ze Stripe)
```

**Secret 2:**
```
Name: STRIPE_PUBLISHABLE_KEY
Value: pk_test_51... (tvůj publishable key)
```

**Secret 3:**
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_... (získáme v kroku 8)
```

**Secret 4:**
```
Name: APP_URL
Value: http://localhost:3000
```

**TIP:** Secret 3 (WEBHOOK_SECRET) přeskočíme teď, přidáme ho v kroku 8.

---

## ✅ KROK 7: Deploy Edge Functions

```bash
# Přejdi do složky projektu
cd /home/user/Connect-me--Gem

# Deploy všechny 4 funkce (jedna po druhé)

# 1. Checkout session
npx supabase functions deploy create-checkout-session

# 2. Webhook handler
npx supabase functions deploy stripe-webhook

# 3. Send gift
npx supabase functions deploy send-gift

# 4. Request payout
npx supabase functions deploy request-payout

# Ověř, že všechny jsou nasazené
npx supabase functions list
```

**Očekávaný výstup:**
```
┌─────────────────────────────┬─────────┬──────────┐
│ NAME                        │ VERSION │ STATUS   │
├─────────────────────────────┼─────────┼──────────┤
│ create-checkout-session     │ 1       │ ACTIVE   │
│ stripe-webhook              │ 1       │ ACTIVE   │
│ send-gift                   │ 1       │ ACTIVE   │
│ request-payout              │ 1       │ ACTIVE   │
└─────────────────────────────┴─────────┴──────────┘
```

---

## ✅ KROK 8: Vytvoř Stripe Webhook

1. Jdi na: https://dashboard.stripe.com/test/webhooks
2. Klikni **"+ Add endpoint"**
3. Vyplň:
   ```
   Endpoint URL: https://haayvhkovottszzdnzbz.supabase.co/functions/v1/stripe-webhook
   Description: AURA Payment Webhook
   ```
4. Klikni **"Select events"**
5. Vyber tyto 2 eventy:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.payment_failed`
6. Klikni **"Add endpoint"**
7. **ZKOPÍRUJ "Signing secret"** (začíná `whsec_`)
   ```
   whsec_...
   ```

8. Přidej ho do Supabase:
   - Jdi na: https://app.supabase.com/project/haayvhkovottszzdnzbz/settings/functions
   - Klikni **"Add new secret"**
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (tvůj signing secret)
   - Klikni **"Add"**

---

## ✅ KROK 9: Spusť Migration 007 (Pricing + Payouts)

1. Jdi na: https://app.supabase.com/project/haayvhkovottszzdnzbz/sql/new
2. Otevři soubor: `supabase/migrations/007_credit_pricing_and_payouts.sql`
3. Zkopíruj **CELÝ obsah** souboru
4. Vlož do SQL Editoru v Supabase
5. Klikni **"Run"**

**Očekávaný výsledek:**
```
Success. No rows returned.
```

**Ověř, že funguje:**
```sql
-- Spusť tento dotaz
SELECT package_name, credit_amount, currency, price
FROM credit_pricing
WHERE currency = 'CZK'
ORDER BY sort_order;
```

**Mělo by vrátit 4 řádky:**
```
Starter   | 100  | CZK | 113.00
Popular   | 500  | CZK | 454.00
Best Value| 1000 | CZK | 795.00
Premium   | 2500 | CZK | 1704.00
```

---

## ✅ KROK 10: Test Edge Functions

### Test 1: Create Checkout (ručně)

Otevři terminál:

```bash
# Získej auth token (přihlaš se v aplikaci, pak otevři DevTools → Console)
# localStorage.getItem('supabase.auth.token')

# Testuj endpoint
curl -X POST https://haayvhkovottszzdnzbz.supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer [TVŮJ_AUTH_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "test-123",
    "creditAmount": 100,
    "price": 4.99,
    "currency": "USD"
  }'
```

**Očekávaný výsledek:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Test 2: View Function Logs

```bash
# Sleduj logy v reálném čase
npx supabase functions logs create-checkout-session --tail

# Nebo v prohlížeči:
# https://app.supabase.com/project/haayvhkovottszzdnzbz/functions/create-checkout-session/logs
```

---

## ✅ KROK 11: Test v Aplikaci

1. **Spusť dev server:**
   ```bash
   npm run dev
   ```

2. **Otevři aplikaci:**
   ```
   http://localhost:3000/cs
   ```

3. **Registruj se nebo přihlaš se**

4. **Jdi do Shopu:**
   ```
   http://localhost:3000/cs/profile/me/shop
   ```

5. **Měl bys vidět:**
   - ✅ 4 balíčky kreditů v CZK
   - ✅ Tvůj aktuální balance
   - ✅ "Buy Now" tlačítka

6. **Klikni "Buy Now" na Starter (113 Kč)**
   - Měl by tě přesměrovat na Stripe Checkout

7. **Použij testovací kartu:**
   ```
   Card number: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```

8. **Klikni "Pay"**
   - Měl by tě přesměrovat zpět
   - Kredity by se měly přidat automaticky (webhook)

9. **Zkontroluj balance:**
   - Obnovíš stránku
   - Balance by měl být: 100 kreditů ✅

---

## ✅ KROK 12: Ověř v Databázi

Jdi do Supabase Table Editor:

```
https://app.supabase.com/project/haayvhkovottszzdnzbz/editor
```

**Zkontroluj tabulku `credits`:**
- Najdi svého uživatele
- `purchased_credits` by mělo být 100
- `balance` by mělo být 100

**Zkontroluj tabulku `transactions`:**
- Měl by tam být záznam
- `type`: credit_purchase
- `status`: completed
- `credit_amount`: 100

---

## ✅ SUCCESS! 🎉

Pokud všechno fungovalo, máš:
- ✅ Stripe účet nastaven
- ✅ Edge Functions nasazené
- ✅ Webhook endpoint fungující
- ✅ Shop načítá ceny z DB
- ✅ Platby fungují end-to-end

---

## 🐛 Troubleshooting

### Problém: "Unauthorized" error

**Řešení:**
- Ujisti se, že jsi přihlášený
- Zkontroluj, že auth token je platný
- Odhlásit se a přihlásit znovu

### Problém: "Failed to load packages"

**Řešení:**
- Zkontroluj, že migration 007 byla spuštěna
- Ověř: `SELECT * FROM credit_pricing LIMIT 1;`
- Mělo by vrátit data

### Problém: Webhook nepřidává kredity

**Řešení:**
1. Zkontroluj webhook secret v Supabase
2. Zkontroluj logy:
   ```bash
   npx supabase functions logs stripe-webhook --tail
   ```
3. Zkontroluj Stripe Dashboard → Webhooks → See recent deliveries

### Problém: Functions se nenasadí

**Řešení:**
```bash
# Zkus znovu s verbose
npx supabase functions deploy create-checkout-session --debug

# Nebo zkontroluj, že jsi linknutý
npx supabase projects list
```

---

## 📞 Need Help?

- **Stripe Docs:** https://stripe.com/docs/checkout
- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Edge Functions Examples:** https://github.com/supabase/supabase/tree/master/examples/edge-functions

---

**Až dodělám, řekni mi a půjdeme na B) Gift Modal!** 🎁

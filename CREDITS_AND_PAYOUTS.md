## 💰 CREDIT SYSTEM & PAYOUTS

Kompletní dokumentace pro mezinárodní credit systém s anti-arbitrage ochranou a 60% provizí.

---

## 📊 Ekonomický Model

### **Provizní Structure (jako TikTok)**

```
Uživatel A → pošle dárek 50 kreditů → Uživatel B

Uživatel B získá:
- 50 kreditů do "earned_credits"
- $0.50 USD do "cash_balance_usd"

Když Uživatel B požádá o výplatu:
- Celková hodnota: $0.50 USD
- Provize platformy (60%): $0.30 USD
- Výplata uživateli (40%): $0.20 USD
```

**Provize pokrývá:**
- ✅ Vývoj aplikace
- ✅ Server hosting
- ✅ Stripe fees (~3%)
- ✅ Marketing
- ✅ Support
- ✅ Údržbu a aktualizace

---

## 🌍 Mezinárodní Pricing

### **Pevné Kurzy (Anti-Arbitrage)**

Kurzy jsou **mírně podstřelené** (3-5% pod trhem), aby nikdo nepřejížděl hranice:

| Měna | Kurz k USD | Skutečný trh | Rozdíl | Symbol |
|------|-----------|--------------|--------|--------|
| USD  | 1.000000  | 1.00         | 0%     | $      |
| EUR  | 1.080000  | ~1.10        | -1.8%  | €      |
| GBP  | 1.250000  | ~1.27        | -1.6%  | £      |
| CZK  | 0.044000  | ~0.046       | -4.3%  | Kč     |
| PLN  | 0.245000  | ~0.25        | -2.0%  | zł     |
| CAD  | 0.725000  | ~0.74        | -2.0%  | C$     |
| AUD  | 0.655000  | ~0.67        | -2.2%  | A$     |

**Proč podstřelené kurzy?**
- Zabraňuje "cross-border shopping" (lidé z CZ nebudou kupovat v PLN)
- Jednodušší správa (nemusíme aktualizovat každý den)
- Ochrana před výkyvy trhu

---

## 📦 Credit Packages

### **4 Balíčky s Progresivní Slevou**

| Package    | Kredity | USD    | EUR   | GBP   | CZK     | Sleva |
|-----------|---------|--------|-------|-------|---------|-------|
| Starter   | 100     | $4.99  | €4.62 | £3.99 | 113 Kč  | 0%    |
| Popular   | 500     | $19.99 | €18.51| £15.99| 454 Kč  | 20%   |
| Best Value| 1000    | $34.99 | €32.40| £27.99| 795 Kč  | 30%   |
| Premium   | 2500    | $74.99 | €69.43| £59.99| 1704 Kč | 40%   |

**Výpočet:**
```javascript
Base rate: 100 credits = $5.00 ($0.05/credit)
Popular:   500 credits = $19.99 (20% off → $0.04/credit)
Best Value: 1000 credits = $34.99 (30% off → $0.035/credit)
Premium:   2500 credits = $74.99 (40% off → $0.03/credit)
```

---

## 🎁 Dárečky a Kredity

### **Gift Credit Values**

| Dáreček      | Kredity | USD Hodnota | Příjemce dostane* |
|--------------|---------|-------------|-------------------|
| Růže         | 10      | $0.10       | $0.04 (40%)       |
| Srdce        | 20      | $0.20       | $0.08 (40%)       |
| Diamant      | 50      | $0.50       | $0.20 (40%)       |
| Šampaňské    | 100     | $1.00       | $0.40 (40%)       |
| Luxusní Auto | 500     | $5.00       | $2.00 (40%)       |

*Po odečtení 60% provize platformy

### **User Flow**

1. **Uživatel A** koupí 100 kreditů za $4.99
2. **Uživatel A** pošle "Diamant" (50 kreditů) **Uživateli B**
3. **Uživatel B** získá:
   - `earned_credits`: +50
   - `cash_balance_usd`: +$0.20 (po provizi)
4. **Uživatel B** může:
   - Použít 50 kreditů na další dárečky
   - Nebo požádat o výplatu (min $10)

---

## 💸 Payout System

### **Minimální Výplata**

```
Minimum: $10 USD po provizi
= 2500 earned_credits před provizí
= 6250 earned_credits celkem (protože dostane jen 40%)
```

**Příklad:**
```
Uživatel nasbíral 5000 earned_credits:
- Hodnota před provizí: $50 USD
- Provize (60%): -$30 USD
- Výplata uživateli (40%): $20 USD ✅
```

### **Supported Payment Methods**

1. **Bank Account** (SEPA, ACH)
   - Nejlevnější (Stripe fee ~0.5%)
   - 3-5 pracovních dní

2. **PayPal**
   - Rychlejší (1-2 dny)
   - Vyšší poplatky (~2%)

### **Payout Flow**

```
1. User clicks "Request Payout"
   ↓
2. Enters amount & payment details
   ↓
3. System validates:
   - Minimum $10 USD
   - Sufficient earned_credits
   - Valid payment method
   ↓
4. Creates payout_request (status: pending)
   ↓
5. Admin reviews (optional)
   ↓
6. Stripe Payout initiated (status: processing)
   ↓
7. Payment sent (status: completed)
   ↓
8. User receives money in 1-5 days
```

---

## 🛡️ Anti-Arbitrage Protection

### **Detekce Arbitráže**

```typescript
// Příklad: Uživatel z CZ kupuje v PLN
checkArbitrageRisk('CZ', 'PLN')
// → { risk: true, message: "User from CZ purchasing in PLN" }
```

**Ochranná opatření:**

1. **Pevné kurzy** pod trhem
2. **Geo-matching** - varování při nákupu v jiné měně
3. **Rate limiting** - max 5 nákupů denně
4. **Manual review** - nákupy >$100 kontroluje admin
5. **Device fingerprinting** - detekce VPN

---

## 🗄️ Database Schema

### **Rozšíření `credits` tabulky**

```sql
ALTER TABLE public.credits ADD COLUMN
    balance INTEGER DEFAULT 0,              -- purchased + earned
    purchased_credits INTEGER DEFAULT 0,    -- Bought via Stripe
    earned_credits INTEGER DEFAULT 0,       -- From gifts received
    cash_balance_usd DECIMAL(10,2),        -- Available for payout
    lifetime_earnings_usd DECIMAL(10,2),   -- Total ever earned
    lifetime_spent_credits INTEGER;         -- Total ever spent
```

### **Nové tabulky**

1. **`credit_pricing`** - Balíčky kreditů podle měn
2. **`exchange_rates`** - Pevné kurzy
3. **`payout_requests`** - Žádosti o výplatu
4. **`payout_history`** - Audit log

---

## 🔌 API Endpoints (TODO)

### **Credit Purchase**

```typescript
POST /api/stripe/create-checkout-session
Body: {
  packageId: string
  creditAmount: number
  price: number
  currency: string
  userId: string
}
Response: {
  sessionId: string
  url: string // Redirect to Stripe
}
```

### **Send Gift**

```typescript
POST /api/credits/send-gift
Body: {
  senderId: string
  recipientId: string
  giftId: string
  creditCost: number
}
Response: {
  success: boolean
  transactionId: string
}
```

### **Request Payout**

```typescript
POST /api/stripe/request-payout
Body: {
  userId: string
  amountUsd: number
  currency: string
  paymentMethod: 'bank_account' | 'paypal'
  paymentDetails: {...}
}
Response: {
  payoutRequestId: string
}
```

---

## 📈 Analytics & Metrics

### **Key Metrics to Track**

1. **Revenue Metrics**
   - Total credits sold (by currency)
   - Average purchase value
   - Conversion rate (visitors → buyers)

2. **Engagement Metrics**
   - Gifts sent per day
   - Average gift value
   - Top earners (creators)

3. **Payout Metrics**
   - Total payouts (by currency)
   - Average payout amount
   - Payout retention (% who reinvest)

4. **Arbitrage Detection**
   - Cross-border purchases
   - VPN detection rate
   - Flagged transactions

---

## 🚀 Next Steps

### **Phase 1: Database Setup** ✅
- [x] Run migration 007
- [x] Verify pricing packages
- [x] Check exchange rates

### **Phase 2: Backend API** (TODO)
- [ ] Create Stripe Checkout endpoint
- [ ] Create webhook handler for payments
- [ ] Create gift sending endpoint
- [ ] Create payout request endpoint

### **Phase 3: Frontend** (TODO)
- [ ] Shop page with credit packages
- [ ] Gift sending in chat
- [ ] Payout request page
- [ ] Transaction history

### **Phase 4: Admin Dashboard** (TODO)
- [ ] Review payout requests
- [ ] Approve/reject payouts
- [ ] Arbitrage detection alerts
- [ ] Revenue analytics

---

## 💡 Business Logic Examples

### **Example 1: User Journey**

```
Day 1: Alice registers
Day 2: Alice buys 500 credits ($19.99)
Day 3: Alice sends 5× Diamond gifts (250 credits)
       → 5 recipients each get 50 earned_credits ($0.20 payout value)
Day 7: One recipient (Bob) has 2500 earned_credits
       → Bob requests payout: $10 → receives $4 (40%)
```

### **Example 2: Power User**

```
Creator (Eva) receives 100 gifts/day:
- Average gift: 50 credits
- Daily earned: 5000 credits = $20 payout value
- Monthly: 150,000 credits = $600 payout value
- After 60% commission: $240/month
```

### **Example 3: Arbitrage Attempt (BLOCKED)**

```
User from CZ tries to buy in PLN (cheaper):
1. Geo-location: Czech Republic
2. Purchase currency: PLN
3. System flags: ARBITRAGE_RISK
4. Admin review required
5. Purchase blocked or allowed with note
```

---

## 🔒 Security Notes

1. **Never store payment details** in Supabase (use Stripe tokens)
2. **Encrypt payout details** (IBAN, account numbers)
3. **Rate limit** payout requests (max 1/day)
4. **2FA required** for payouts >$100
5. **Audit log** all credit transactions

---

## 📞 Support Scenarios

### **User: "Why did I only get $4 for $10 worth of credits?"**

**Response:**
"Our platform operates like TikTok, YouTube, or Twitch - when users send you gifts, you earn credits that can be cashed out. The 60% platform commission covers development, hosting, payment processing (Stripe fees), marketing, and support. Your $10 in received gifts converts to $4 payout after the 60% platform fee. This is standard in creator economy platforms."

### **User: "Can I buy credits in a cheaper currency?"**

**Response:**
"Our pricing is optimized for each region and includes fixed exchange rates to ensure fairness. Attempting to purchase in a different currency may result in your transaction being flagged or rejected."

---

## ✅ Testing Checklist

Before launch:

- [ ] Test all 4 credit packages in all 7 currencies
- [ ] Verify Stripe webhook handles payments correctly
- [ ] Test gift sending reduces sender's credits
- [ ] Test gift receiving adds earned_credits
- [ ] Test payout request with minimum amount
- [ ] Test payout request below minimum (should fail)
- [ ] Test arbitrage detection with VPN
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test commission calculation (60/40 split)
- [ ] Load test: 1000 concurrent purchases

---

Made with 💜 by AURA Team

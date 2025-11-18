# 📧 Email Flow Documentation - Connect Me

> **Strategie:** Minimalizovat email spam, maximalizovat in-app notifikace (zvoneček 🔔)

---

## 🎯 Hlavní zásady

1. **Email JEN pro kritické události** (bezpečnost, transakce, důležité akce)
2. **Zvoneček pro vše ostatní** (zprávy, lajky, matche, dárky)
3. **Uživatel si může vypnout email notifikace** (kromě bezpečnostních)
4. **Marketing emaily MAX 1-2x měsíčně** (kvalita > kvantita)

---

## ✅ Transactional Emaily (VŽDY posílat)

Tyto emaily jsou **povinné** a nelze je vypnout (jsou nutné pro bezpečnost a funkčnost).

### 1. **Registrace & Ověření**

| Událost | Email | Kdy se posílá | Template | Priorita |
|---------|-------|---------------|----------|----------|
| Nová registrace | Email Confirmation | Okamžitě po registraci | `confirm_email.html` | 🔴 KRITICKÉ |
| Ověření emailu | Welcome Email | Po kliknutí na confirm link | `welcome.html` | 🟢 STŘEDNÍ |

**Email Confirmation:**
```
Předmět: Potvrď svůj email - Connect Me ❤️
Obsah:
- Uvítací zpráva
- Tlačítko "Potvrdit email"
- Link platný 24 hodin
- Informace co získáš po potvrzení
```

**Welcome Email:**
```
Předmět: Vítej v Connect Me! 💖
Obsah:
- Gratulace k registraci
- Jak začít (vyplnit profil, nahrát fotky, najít první match)
- CTA: "Dokončit profil"
- Tipy pro úspěch
```

---

### 2. **Bezpečnost & Account**

| Událost | Email | Kdy se posílá | Template | Priorita |
|---------|-------|---------------|----------|----------|
| Zapomenuté heslo | Password Reset | Po kliknutí "Forgot password" | `password_reset.html` | 🔴 KRITICKÉ |
| Změna hesla | Password Changed | Po změně hesla | `password_changed.html` | 🔴 KRITICKÉ |
| Přihlášení z nového zařízení | New Login Alert | První login z nového IP/device | `new_login.html` | 🟡 VYSOKÁ |
| Změna emailu | Email Change Confirmation | Po požadavku o změnu emailu | `email_change.html` | 🔴 KRITICKÉ |

**Password Reset:**
```
Předmět: Reset hesla - Connect Me
Obsah:
- "Požádal jsi o reset hesla"
- Tlačítko "Nastavit nové heslo"
- Link platný 1 hodinu
- "Pokud jsi to nebyl ty, ignoruj tento email"
```

**Password Changed:**
```
Předmět: ⚠️ Tvoje heslo bylo změněno
Obsah:
- "Heslo k tvému účtu bylo právě změněno"
- Čas a IP adresa
- "Pokud jsi to nebyl ty, okamžitě kontaktuj support"
- Odkaz na support
```

---

### 3. **Platby & Transakce**

| Událost | Email | Kdy se posílá | Template | Priorita |
|---------|-------|---------------|----------|----------|
| Nákup kreditů | Payment Receipt | Po úspěšné platbě | `payment_receipt.html` | 🔴 KRITICKÉ |
| Nákup Premium | Subscription Confirmation | Po upgrade na Premium | `premium_confirmation.html` | 🔴 KRITICKÉ |
| Konec Premium | Subscription Expired | Den před vypršením + den po | `subscription_expired.html` | 🟡 VYSOKÁ |
| Refund | Refund Processed | Po zpracování refundu | `refund.html` | 🔴 KRITICKÉ |
| Failed Payment | Payment Failed | Pokud se nepodaří zaplatit | `payment_failed.html` | 🟡 VYSOKÁ |

**Payment Receipt:**
```
Předmět: Faktura #12345 - Nákup kreditů
Obsah:
- "Děkujeme za nákup!"
- Detaily objednávky (kredity, částka, datum)
- PDF faktura (příloha)
- Aktuální zůstatek kreditů
- CTA: "Použít kredity"
```

**Subscription Confirmation:**
```
Předmět: 🎉 Vítej v Connect Me Premium!
Obsah:
- Gratulace k upgradu
- Co získáváš (neomezené lajky, vidět kdo tě lajkl, boost profilu...)
- Datum další platby
- CTA: "Prozkoumat Premium funkce"
```

---

### 4. **Výplaty (pro content creators)**

| Událost | Email | Kdy se posílá | Template | Priorita |
|---------|-------|---------------|----------|----------|
| Výplata schválena | Payout Approved | Po schválení výplaty | `payout_approved.html` | 🟡 VYSOKÁ |
| Výplata odeslána | Payout Sent | Po odeslání peněz | `payout_sent.html` | 🔴 KRITICKÉ |
| Výplata zamítnuta | Payout Rejected | Pokud je zamítnuta | `payout_rejected.html` | 🔴 KRITICKÉ |

---

## 🔔 In-App Notifications (NIKDY email!)

Tyto události zobrazujeme **POUZE ve zvonečku** v navigaci.

| Událost | Notifikace | Důvod |
|---------|------------|-------|
| 💬 Nová zpráva | "Jan ti poslal zprávu" | Spam risk, uživatel často v apce |
| ❤️ Nový lajk | "Marie tě lajkla" | Běžná aktivita, ne kritická |
| ✨ Nový match | "Máš nový match s Petrem!" | Důležité, ale ne emergency |
| 🎁 Dostal jsi dárek | "Anna ti poslala růži 🌹" | Milá událost, ale ne kritická |
| 👀 Návštěva profilu | "5 lidí si prohlédlo tvůj profil" | Informativní, ne důležité |
| ⭐ Nový follower | "Tomáš tě začal sledovat" | Nice-to-know |
| 🔥 Boost aktivován | "Tvůj profil je teď boosted!" | Potvrzení akce |

---

## 📊 Marketing & Engagement Emaily (volitelné)

Tyto emaily posíláme **MAX 1-2x měsíčně** a uživatel je může **vypnout** v nastavení.

### 1. **Weekly Digest** (opt-in, default OFF)

```
Předmět: 📊 Tvůj týdenní přehled - 12 nových lajků!
Frekvence: 1x týdně (neděle večer)
Podmínka: Pouze pokud má uživatel aktivitu (lajky, zprávy, matche)
Obsah:
- Souhrn týdne (X lajků, Y matchů, Z zpráv)
- Top 3 profily, které by se mu mohly líbit
- Tipy na zlepšení profilu (pokud má nízkou aktivitu)
- CTA: "Prozkoumat nové profily"
```

### 2. **Re-engagement** (7 dnů neaktivity)

```
Předmět: Chybíš nám! 3 lidi tě lajkli zatímco jsi byl pryč
Frekvence: Max 1x za 14 dní
Podmínka: Uživatel nebyl aktivní 7+ dní
Obsah:
- "Vrať se, stalo se toho hodně!"
- Počet nových lajků/matchů
- Preview nových profilů v okolí
- CTA: "Vrátit se"
```

### 3. **Speciální nabídky**

```
Předmět: 🎉 Black Friday: 50% sleva na Premium!
Frekvence: Max 2x měsíčně
Obsah:
- Exkluzivní nabídka
- Časově omezená akce
- Co získá (Premium benefits)
- CTA: "Získat slevu"
```

### 4. **Product Updates** (opt-in)

```
Předmět: 🚀 Nové funkce v Connect Me!
Frekvence: Max 1x měsíčně
Obsah:
- Představení nové funkce (např. video profily)
- Jak ji použít
- CTA: "Vyzkoušet"
```

---

## ⚙️ User Settings - Email Preferences

Uživatel může v nastavení vypnout:

✅ **NELZE vypnout** (bezpečnostní + transactional):
- Email confirmation
- Password reset
- Bezpečnostní upozornění
- Platební potvrzení / faktury
- Výplaty

🔕 **MŮŽE vypnout**:
- Weekly digest
- Re-engagement emaily
- Marketing & nabídky
- Product updates

---

## 📈 Email Limits & Rate Limiting

### Frekvence limitů:

| Typ emailu | Maximum |
|------------|---------|
| Transactional | Neomezené (nutné) |
| Weekly digest | 1x týdně |
| Re-engagement | 1x za 14 dní |
| Marketing | 2x měsíčně |
| Product updates | 1x měsíčně |

### Celkový email budget:

**Ideální:** Uživatel by měl dostat **MAX 8-10 emailů měsíčně** (včetně transactional).

---

## 🛠️ Technické nastavení

### SMTP Provider: **Resend.com**

```env
RESEND_API_KEY=re_xxxxx
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
FROM_EMAIL=noreply@connectme.cz
FROM_NAME=Connect Me
```

### Supabase Auth Email Templates

V Supabase Dashboard → Authentication → Email Templates:

1. **Confirm signup** → `confirm_email.html`
2. **Invite user** → `invite.html`
3. **Magic Link** → `magic_link.html`
4. **Change Email Address** → `email_change.html`
5. **Reset Password** → `password_reset.html`

---

## 📧 Email Template Struktur

Všechny emaily by měly obsahovat:

### Header:
- Logo Connect Me ❤️
- Preheader text (první řádek zobrazený v inboxu)

### Body:
- Jasný nadpis
- Stručný popis (max 2-3 věty)
- CTA button (výrazný, jasný)
- Sekundární informace (pokud nutné)

### Footer:
- Odhlášení z marketingových emailů (pokud je to marketing)
- Kontakt na support: support@connectme.cz
- Sociální sítě
- Adresa společnosti
- "© 2024 Connect Me. Všechna práva vyhrazena."

### Design:
- Responsive (mobile-first)
- Light/Dark mode friendly
- Gradient brand colors (pink/purple)
- Emoji v tématických emailech ❤️✨🎉

---

## 🔍 Tracking & Analytics

### Co měřit:

| Metrika | Cíl |
|---------|-----|
| Open rate | >20% (transactional), >15% (marketing) |
| Click rate | >3% |
| Unsubscribe rate | <0.5% |
| Spam complaints | <0.1% |
| Bounce rate | <2% |

### Tracking events:

```typescript
// Email events to track
enum EmailEvent {
  SENT = 'email_sent',
  DELIVERED = 'email_delivered',
  OPENED = 'email_opened',
  CLICKED = 'email_clicked',
  BOUNCED = 'email_bounced',
  COMPLAINED = 'email_complained',
  UNSUBSCRIBED = 'email_unsubscribed'
}
```

---

## 🚀 Implementation Checklist

### Fáze 1: Development (TEĎKA)
- [x] Dokumentace email flow
- [ ] Připravit HTML šablony (mock)
- [ ] Otestovat Supabase default SMTP

### Fáze 2: Pre-launch (po získání domény)
- [ ] Setup Resend account
- [ ] Verify doménu (DNS záznamy)
- [ ] Nakonfigurovat Supabase SMTP
- [ ] Nahrát custom email šablony
- [ ] Otestovat všechny typy emailů
- [ ] Nastavit tracking/analytics

### Fáze 3: Post-launch
- [ ] Monitorovat email metriky
- [ ] A/B testovat subject lines
- [ ] Optimalizovat templates
- [ ] Přidat Listmonk (pokud přerosteš 3K emails/měsíc)

---

## 💡 Best Practices

1. **Subject line:**
   - Max 50 znaků
   - Použij emoji (ale ne více než 1-2)
   - Jasný benefit/akce
   - A/B testuj

2. **Preheader:**
   - 90-110 znaků
   - Doplň subject line, neopakuj
   - Vytvoř urgenci/curiosity

3. **CTA button:**
   - Jeden primární CTA per email
   - Jasný action text ("Potvrdit email", "Získat Premium")
   - Kontrastní barva
   - Dostatečně velký (min 44x44px na mobile)

4. **Mobile-first:**
   - 90% uživatelů otevírá emaily na mobile
   - Text min 16px
   - CTA buttons min 44px výška
   - Jednosloupcový layout

5. **Spam prevence:**
   - Vyhni se "FREE", "GUARANTEE", "CLICK NOW"
   - Správný SPF, DKIM, DMARC
   - Opt-out link v každém marketingovém emailu
   - Nepouživej zkrácené URL

---

## 📞 Support Contact

Pro problémy s emaily:
- **Email:** support@connectme.cz
- **Response time:** <24 hodin

---

**Poslední update:** 2024-11-18
**Autor:** AI Assistant
**Status:** ✅ READY FOR IMPLEMENTATION

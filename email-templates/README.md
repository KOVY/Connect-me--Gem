# 📧 Email Templates - Connect Me

Profesionální, responzivní HTML šablony pro emailovou komunikaci s uživateli.

---

## 📁 Dostupné šablony

### 1. `confirm_email.html` - Email Confirmation
**Kdy se používá:** Po registraci nového uživatele

**Proměnné:**
```
{{ USER_NAME }}          - Jméno uživatele
{{ CONFIRMATION_URL }}   - Link pro potvrzení emailu
```

**Preview:**
- Emoji: 💖
- CTA: "✨ Potvrdit email"
- Varování: Link platný 24 hodin

---

### 2. `welcome.html` - Welcome Email
**Kdy se používá:** Po úspěšném ověření emailu

**Proměnné:**
```
{{ USER_NAME }}   - Jméno uživatele
{{ APP_URL }}     - Link do aplikace
```

**Preview:**
- Emoji: 🎉
- Obsahuje: 3-krokový onboarding guide
- CTA: "🚀 Začít hledat"
- Tipy pro úspěch

---

### 3. `password_reset.html` - Password Reset
**Kdy se používá:** Když uživatel zapomene heslo

**Proměnné:**
```
{{ USER_NAME }}   - Jméno uživatele
{{ RESET_URL }}   - Link pro reset hesla
```

**Preview:**
- Emoji: 🔐
- CTA: "🔑 Nastavit nové heslo"
- Bezpečnostní varování: Link platný 1 hodinu
- Upozornění: Co dělat, pokud o reset nežádal

---

### 4. `payment_receipt.html` - Payment Receipt / Invoice
**Kdy se používá:** Po úspěšné platbě (kredity, premium, dárky)

**Proměnné:**
```
{{ INVOICE_NUMBER }}    - Číslo faktury (např. "INV-2024-001")
{{ ITEM_NAME }}         - Název produktu (např. "100 kreditů")
{{ ITEM_PRICE }}        - Cena položky (např. "299")
{{ TOTAL_AMOUNT }}      - Celková částka (např. "299")
{{ PAYMENT_METHOD }}    - Platební metoda (např. "Visa •••• 4242")
{{ PAYMENT_DATE }}      - Datum platby (např. "18.11.2024")
{{ TRANSACTION_ID }}    - ID transakce z Stripe
{{ CREDIT_BALANCE }}    - Aktuální zůstatek kreditů
{{ APP_URL }}           - Link do aplikace
{{ INVOICE_PDF_URL }}   - Link na PDF fakturu (volitelné)
```

**Preview:**
- Emoji: ✅
- Barva headeru: Zelená (success)
- Obsahuje: Detaily objednávky, platební info, aktuální zůstatek
- CTA: "🚀 Použít kredity"

---

## 🎨 Design System

### Brand Colors
```css
/* Primary Gradient */
background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);

/* Pink */
#ec4899 (rgb(236, 72, 153))

/* Purple */
#8b5cf6 (rgb(139, 92, 246))
```

### Typography
```css
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Headings:
- H1: 28px, font-weight: 700
- H2: 24px, font-weight: 700
- H3: 18px, font-weight: 700

Body:
- Text: 16px, line-height: 1.6
- Small: 14px, line-height: 1.6
- Tiny: 13px, line-height: 1.5
```

### Buttons
```css
Primary CTA:
- Padding: 16px 48px
- Border-radius: 12px
- Background: gradient (pink → purple)
- Font-size: 16px
- Font-weight: 600
- Color: white
```

### Spacing
```css
Container: 600px max-width
Padding: 32-40px
Border-radius: 12-16px
```

---

## 📱 Responsive & Compatibility

### Mobile Support
- Breakpoint: 600px
- Buttons: 100% width na mobile
- Font-size: Automaticky upraveno
- Layout: Single column

### Email Client Support
✅ **Podporováno:**
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS)
- Outlook (Web, 2016+)
- Yahoo Mail
- ProtonMail
- Seznam Email

⚠️ **Částečně:**
- Outlook 2010-2013 (gradient → solid color fallback)
- Windows Mail (jednodušší layout)

### Dark Mode
- Automatická detekce: `@media (prefers-color-scheme: dark)`
- Background: #1a1a1a
- Card: #2a2a2a
- Text: upravené barvy pro čitelnost

---

## 🔧 Použití v Supabase Auth

### 1. Naviguj do Supabase Dashboard
```
Settings → Authentication → Email Templates
```

### 2. Nahraj šablonu
Pro každý typ emailu:
- **Confirm signup** → `confirm_email.html`
- **Reset password** → `password_reset.html`
- *(Welcome email se posílá custom logiku)*

### 3. Použij Supabase proměnné
Supabase používá jiné proměnné:

| Naše proměnná | Supabase proměnná |
|---------------|-------------------|
| `{{ CONFIRMATION_URL }}` | `{{ .ConfirmationURL }}` |
| `{{ RESET_URL }}` | `{{ .PasswordResetURL }}` |
| `{{ USER_NAME }}` | `{{ .UserName }}` nebo custom metadata |

**Příklad konfigurace:**
```html
<!-- V šabloně nahraď: -->
{{ CONFIRMATION_URL }}

<!-- Za Supabase verzi: -->
{{ .ConfirmationURL }}
```

---

## 🚀 Použití s Resend API

### Příklad kódu (TypeScript):

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Welcome Email
await resend.emails.send({
  from: 'Connect Me <noreply@connectme.cz>',
  to: user.email,
  subject: 'Vítej v Connect Me! 💖',
  html: welcomeTemplate
    .replace('{{ USER_NAME }}', user.name)
    .replace('{{ APP_URL }}', 'https://connectme.cz/cs'),
});

// Payment Receipt
await resend.emails.send({
  from: 'Connect Me <noreply@connectme.cz>',
  to: user.email,
  subject: `Faktura #${invoiceNumber} - Děkujeme za nákup!`,
  html: paymentReceiptTemplate
    .replace('{{ INVOICE_NUMBER }}', invoiceNumber)
    .replace('{{ ITEM_NAME }}', '100 kreditů')
    .replace('{{ ITEM_PRICE }}', '299')
    .replace('{{ TOTAL_AMOUNT }}', '299')
    .replace('{{ PAYMENT_METHOD }}', 'Visa •••• 4242')
    .replace('{{ PAYMENT_DATE }}', new Date().toLocaleDateString('cs-CZ'))
    .replace('{{ TRANSACTION_ID }}', stripePaymentId)
    .replace('{{ CREDIT_BALANCE }}', user.credits.toString())
    .replace('{{ APP_URL }}', 'https://connectme.cz/cs')
    .replace('{{ INVOICE_PDF_URL }}', pdfUrl),
});
```

---

## ✅ Testing Checklist

Před nasazením do produkce otestuj:

### Funkčnost:
- [ ] Všechny linky fungují
- [ ] CTA buttony jsou klikatelné
- [ ] Proměnné jsou správně nahrazeny
- [ ] Footer linky vedou na správné stránky

### Design:
- [ ] Email vypadá dobře na desktopu
- [ ] Email vypadá dobře na mobile (< 600px)
- [ ] Barvy odpovídají brand identity
- [ ] Emoji se zobrazují správně

### Kompatibilita:
- [ ] Gmail (web)
- [ ] Gmail (mobile app)
- [ ] Apple Mail (macOS)
- [ ] Apple Mail (iOS)
- [ ] Outlook (web)
- [ ] Dark mode

### Spam Prevention:
- [ ] Subject line není spammy
- [ ] Text/Image ratio je OK (60/40)
- [ ] Unsubscribe link je viditelný
- [ ] From email je verifikovaný (SPF/DKIM)

---

## 📊 Best Practices

### Subject Lines:
```
✅ DOBŘE:
"Potvrď svůj email - Connect Me ❤️"
"✅ Platba úspěšná! Faktura #12345"
"🔐 Reset hesla - Connect Me"

❌ ŠPATNĚ:
"URGENT!!! CONFIRM NOW!!!"
"FREE CREDITS CLICK HERE"
"You won't believe this..."
```

### Preheaders:
```
✅ DOBŘE:
"Potvrď svůj email a začni hledat lásku ❤️"
"Faktura #12345 - Děkujeme za nákup!"

❌ ŠPATNĚ:
"Klikni zde pro více informací..."
"Email confirmation link below..."
```

### CTA Buttons:
```
✅ DOBŘE:
"✨ Potvrdit email"
"🚀 Začít hledat"
"🔑 Nastavit nové heslo"

❌ ŠPATNĚ:
"Click here"
"Submit"
"Go"
```

---

## 🔍 Troubleshooting

### Problém: Email končí ve spamu
**Řešení:**
- Ověř SPF, DKIM, DMARC záznamy
- Přidej unsubscribe link
- Zlepši text/image ratio
- Používej verifikovanou doménu

### Problém: Linky nefungují
**Řešení:**
- Zkontroluj, že URL začíná `https://`
- Testuj na různých klientech
- Použij absolute URLs (ne relative)

### Problém: Design je rozbitý v Outlook
**Řešení:**
- Outlook 2010-2013 má omezený CSS support
- Používej table-based layout (už děláme)
- Testuj s Litmus nebo Email on Acid

### Problém: Dark mode vypadá špatně
**Řešení:**
- Přidej `@media (prefers-color-scheme: dark)` styly
- Testuj na iOS/macOS v dark mode
- Použij color-scheme meta tag

---

## 📞 Support

Pro otázky nebo customizace šablon:
- **Email:** dev@connectme.cz
- **Dokumentace:** /EMAIL_FLOW_DOCUMENTATION.md

---

**Poslední update:** 2024-11-18
**Autor:** AI Assistant
**Version:** 1.0.0

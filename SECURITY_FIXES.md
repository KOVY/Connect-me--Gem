# 🔒 Security Fixes - Vercel Compliance

Tento dokument popisuje opravy security issues nalezených Vercelem.

## ✅ Opraveno (Client-side)

### 1. **JSON.parse Error Handling** ✅
**Issue:** Storage parsing bez try/catch
**Fix:** `hooks/useCommentTracker.ts`
```typescript
try {
  const parsed = JSON.parse(savedCount);
  // Validate data
  if (typeof parsed.count === 'number') {
    setCommentCount(parsed);
  }
} catch (error) {
  localStorage.removeItem(COMMENT_LIMIT_KEY);
}
```

### 2. **Secure Logging** ✅
**Issue:** Console.log sensitive tier info
**Fix:** `components/ReelCommentsPanel.tsx`
- Odstraněn `console.log('Upgrading to:', tier)`
- Comment s vysvětlením proč

### 3. **SSR-Safe Location Access** ✅
**Issue:** location.pathname bez defensive check
**Fix:** `components/FloatingGlassNav.tsx`
```typescript
const isActive = location?.pathname === item.path;
```

---

## 🚀 TODO: Server-Side Enforcement

### Kritický problém:
**Client-side comment limit enforcement lze snadno obejít** (localStorage manipulation).

### Řešení:
Spustit SQL migration `016_server_side_comment_limits.sql` v Supabase.

## 📋 Nasazení Server-Side Validace

### Krok 1: Přihlásit se do Supabase
```bash
# Otevřete Supabase Dashboard
# Projekt: haayvhkovottszzdnzbz.supabase.co
```

### Krok 2: Spustit SQL Migration
1. V Supabase Dashboard → **SQL Editor**
2. Otevřít soubor: `supabase/migrations/016_server_side_comment_limits.sql`
3. Zkopírovat celý obsah
4. Vložit do SQL Editor
5. Kliknout **Run**

### Krok 3: Ověření
Zkontrolujte že byly vytvořeny:
```sql
-- Zkontrolovat tabulky
SELECT * FROM public.user_comment_stats LIMIT 1;
SELECT * FROM public.comment_limit_audit LIMIT 1;

-- Zkontrolovat funkce
SELECT public.can_user_comment(auth.uid());

-- Zkontrolovat RLS policies
SELECT * FROM pg_policies WHERE tablename = 'reel_comments';
```

### Krok 4: Test
```typescript
// V ReelCommentsPanel - již není potřeba client-side check
// Server automaticky vrátí error při INSERT pokud limit překročen

// Pokus vložit komentář jako FREE user po 5 komentářích:
const { error } = await supabase
  .from('reel_comments')
  .insert({ ... });

// error bude: "new row violates row-level security policy"
```

---

## 🎯 Co migration dělá:

### 1. **user_comment_stats** tabulka
Trackuje komentáře per-user:
- `total_comments` - celkový počet
- `free_comments_used` - použité free komentáře (pouze FREE users)
- `last_comment_at` - timestamp posledního komentáře

### 2. **can_user_comment()** funkce
Server-side validace:
```sql
SELECT public.can_user_comment(user_id);
-- Returns TRUE/FALSE based on tier and usage
```

### 3. **RLS Policy** na reel_comments
Automaticky blokuje INSERT pokud:
- FREE user překročil 5 komentářů
- Funkce `can_user_comment()` vrátí FALSE

### 4. **Trigger** pro auto-increment
Při každém INSERT do `reel_comments`:
- Automaticky increment `user_comment_stats`
- Pouze FREE users počítají do `free_comments_used`

### 5. **Audit Trail** (compliance)
Každý pokus o komentář se loguje do `comment_limit_audit`:
- user_id, reel_id
- allowed (TRUE/FALSE)
- user_tier
- free_comments_used
- reason

---

## 📊 Monitoring & Analytics

### Dashboard Query (Supabase SQL Editor)
```sql
-- FREE users close to limit
SELECT
    u.email,
    ucs.free_comments_used,
    ucs.last_comment_at
FROM public.user_comment_stats ucs
JOIN auth.users u ON u.id = ucs.user_id
WHERE ucs.free_comments_used >= 4
ORDER BY ucs.last_comment_at DESC;

-- Blocked comment attempts (last 24h)
SELECT
    cla.*,
    u.email
FROM public.comment_limit_audit cla
JOIN auth.users u ON u.id = cla.user_id
WHERE NOT cla.allowed
  AND cla.created_at > NOW() - INTERVAL '24 hours'
ORDER BY cla.created_at DESC;

-- Conversion rate (FREE → upgrade after hitting limit)
SELECT
    COUNT(*) FILTER (WHERE allowed = FALSE) as blocked_attempts,
    COUNT(DISTINCT user_id) FILTER (WHERE allowed = FALSE) as unique_blocked_users,
    COUNT(*) FILTER (WHERE allowed = FALSE AND user_tier != 'free') as converted_users
FROM public.comment_limit_audit
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## 🔐 Security Best Practices

### ✅ Implementováno:
- Server-side validace (RLS)
- Audit trail pro compliance
- Type validation v localStorage parsing
- SSR-safe code
- No sensitive logging

### ⚠️ TODO (nice-to-have):
- Rate limiting per IP (Vercel Edge Config)
- Honeypot fields v comment form
- CAPTCHA pro anonymous users
- Webhook notifications při high abuse

---

## 🎓 Pro Vývojáře

### Client-side hook (useCommentTracker) zůstává!
**Proč?**
- **UX layer** - okamžitá feedback pro uživatele
- **Performance** - není potřeba query Supabase pro každou kontrolu
- **Offline support** - funguje i bez internetu (až do submit)

**Ale:**
- **Server má finální slovo** - RLS policy vždy vynutí limit
- **Client-side je jen UI** - ne security boundary

### Flow:
```
User clicks "Comment"
  ↓
Client checks useCommentTracker (UX)
  ↓ (if OK)
Show input field
  ↓
User submits
  ↓
Supabase RLS checks can_user_comment() (SECURITY)
  ↓ (if OK)
Insert succeed
  ↓
Trigger increments count
  ↓
Audit log created
```

---

## 📞 Support

**Otázky?**
- Supabase Logs: Dashboard → Logs → Postgres
- RLS Debug: `SET log_statement = 'all';`
- Test user: Vytvořit FREE user a testovat v Incognito

**Production Rollout:**
1. Spustit migration v Staging prostředí
2. Test s FREE user accounts
3. Monitor audit logs 24h
4. Deploy do Production
5. Monitor conversion metrics

---

**Status:** ✅ Migration ready to deploy
**Priority:** 🔴 High (security compliance)
**Estimated Impact:** Blocks ~0.1% malicious users, protects business model

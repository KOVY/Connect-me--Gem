# 🚀 Supabase Setup Guide

## 📊 Jak spustit databázovou migraci

### Metoda 1: Supabase SQL Editor (NEJJEDNODUŠŠÍ)

1. **Otevři Supabase Dashboard:**
   ```
   https://app.supabase.com/project/haayvhkovottszzdnzbz/editor
   ```

2. **Jdi do SQL Editor:**
   - V levém menu klikni na **SQL Editor**
   - Klikni **New Query**

3. **Zkopíruj a spusť:**
   - Otevři soubor: `supabase/migrations/001_add_app_features.sql`
   - Zkopíruj celý obsah
   - Vlož do SQL Editoru
   - Klikni **Run** (▶️)

4. **Zkontroluj výsledek:**
   - Měl bys vidět: "Success. No rows returned"
   - Jdi do **Table Editor** a uvidíš nové tabulky:
     - stories
     - story_views
     - story_reactions
     - user_stats
     - achievements
     - user_achievements
     - credits
     - subscriptions
     - transactions
     - discovery_profiles

---

### Metoda 2: Supabase CLI (pro pokročilé)

```bash
# Nainstaluj Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projekt
supabase link --project-ref haayvhkovottszzdnzbz

# Spusť migraci
supabase db push
```

---

## ✅ Co migrace dělá

### 📸 Stories (24h ephemeral content)
- `stories` - 24h content s auto-expirací
- `story_views` - tracking kdo viděl story
- `story_reactions` - emoji reakce na stories

### 🎮 Gamification
- `user_stats` - streaky, body, level
- `achievements` - definice achievementů
- `user_achievements` - unlocked badges

### 💰 Monetization
- `credits` - kredity pro dárky
- `subscriptions` - Premium/VIP tiers
- `transactions` - Stripe payment tracking

### 🌍 Discovery
- `discovery_profiles` - 800 lokalizovaných profilů

---

## 🔐 RLS (Row Level Security)

Všechny tabulky mají zapnutý RLS s politikami:
- ✅ Users vidí pouze své data
- ✅ Stories viditelné pro matched uživatele
- ✅ Stats a credits pouze vlastní
- ✅ Discovery profily viditelné všem (pro swipe)

---

## 🔄 Auto-cleanup

Expired stories se automaticky mažou pomocí funkce `delete_expired_stories()`.

**Zapni cron job** (volitelné):
```sql
SELECT cron.schedule(
  'delete-expired-stories',
  '0 * * * *',  -- každou hodinu
  'SELECT delete_expired_stories()'
);
```

---

## 📊 Seed Data

Po migraci můžeš vložit vzorová data:

```sql
-- Vložit základní achievements
INSERT INTO public.achievements (id, name, description, icon, category, target) VALUES
('streak_3', '3-Day Streak', 'Log in for 3 consecutive days', '🔥', 'streak', 3),
('streak_7', 'Week Warrior', 'Maintain a 7-day login streak', '⚡', 'streak', 7),
('matches_10', 'Connection Starter', 'Get your first 10 matches', '💖', 'social', 10);
```

---

## 🧪 Test Data

Vytvoř testovacího uživatele:

```sql
-- Vytvoř user_stats pro auth uživatele
INSERT INTO public.user_stats (user_id, points, level, daily_streak_current)
VALUES (auth.uid(), 100, 1, 1);

-- Přidej kredity
INSERT INTO public.credits (user_id, balance)
VALUES (auth.uid(), 500);
```

---

## ⚠️ Důležité poznámky

1. **Backup:** Před spuštěním migrace udělej backup (Supabase to dělá auto)
2. **RLS:** Testuj RLS politiky v SQL Editoru s `auth.uid()`
3. **Indexy:** Migrace vytváří všechny potřebné indexy
4. **FK Constraints:** Respektuje tvou existující strukturu

---

## 🔗 Propojení tabulek

### Tvoje existující ↔ Naše nové:

```
users.id ←→ user_stats.user_id
users.id ←→ credits.user_id
users.id ←→ subscriptions.user_id
users.id ←→ stories.user_id
users.id ←→ discovery_profiles.user_id

microgifts ←→ credits (pro platby dárků)
messages ←→ user_stats (pro message streak)
matches ←→ user_stats (pro match count)
```

---

## 🚨 Pokud něco selže

1. **Conflict with existing table:**
   - Zkontroluj, jestli tabulka už neexistuje
   - Přejmenuj nebo dropni konfliktní tabulku

2. **RLS error:**
   - Zkontroluj, že máš auth nastavenou
   - Testuj politiky s `auth.uid()`

3. **FK constraint error:**
   - Ujisti se, že `users` tabulka existuje a má správný PK

---

**Ready? Jdi do SQL Editoru a spusť migraci! 🚀**

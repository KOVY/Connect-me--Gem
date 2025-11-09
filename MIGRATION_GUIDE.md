# 🚀 Database Migration Guide

This guide will walk you through running all SQL migrations to populate your Supabase database with 800 AI-generated profiles and gamification features.

## Prerequisites

✅ You already completed:
- Created Supabase project
- Added environment variables to `.env`
- Ran migration `001_add_app_features.sql` successfully

## Step-by-Step: Running Migrations

### 1️⃣ Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `haayvhkovottszzdnzbz`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### 2️⃣ Run Migrations in Order

You need to run these 5 migrations in sequence:

---

#### **Migration 002: USA Profiles (100 profiles)**

📁 File: `supabase/migrations/002_seed_profiles_part1_usa.sql`

1. Open the file in your code editor or GitHub
2. Copy **ALL** the content
3. Paste into Supabase SQL Editor
4. Click **Run** button
5. ✅ Should see: **Success. 100 rows affected**

**What it does:**
- Adds 50 female + 50 male profiles from USA
- American names (Emma, Olivia, Liam, Noah, etc.)
- English language bios
- USA cities (New York, Los Angeles, Chicago, etc.)
- High-quality portrait photos from Unsplash

---

#### **Migration 003: Czech Profiles (100 profiles)**

📁 File: `supabase/migrations/003_seed_profiles_part2_czech.sql`

1. Copy all content from the file
2. Paste into new SQL query in Supabase
3. Click **Run**
4. ✅ Should see: **Success. 100 rows affected**

**What it does:**
- Adds 50 female + 50 male profiles from Czech Republic
- Czech names (Tereza, Lucie, Jan, Petr, etc.)
- **Czech language bios** (miluji cestování, etc.)
- Czech cities (Praha, Brno, Ostrava, etc.)
- Portrait photos

---

#### **Migration 004: 6 More Countries (600 profiles)**

📁 File: `supabase/migrations/004_seed_profiles_remaining_countries.sql`

1. Copy all content
2. Paste into Supabase SQL Editor
3. Click **Run** (this may take 5-10 seconds)
4. ✅ Should see: **Success. 600 rows affected**

**What it does:**
- 100 profiles each for:
  - 🇩🇪 **Germany** (Lukas, Anna, Tim - German bios)
  - 🇫🇷 **France** (Marie, Camille, Lucas - French bios)
  - 🇪🇸 **Spain** (Antonio, María, José - Spanish bios)
  - 🇮🇹 **Italy** (Marco, Giulia, Alessandro - Italian bios)
  - 🇵🇱 **Poland** (Piotr, Anna, Tomasz - Polish bios)
  - 🇵🇹 **Portugal** (João, Maria, Ana - Portuguese bios)
- Each profile has:
  - National names
  - Bios in native language
  - Local cities
  - Realistic occupations

---

#### **Migration 005: Add Photos to All Profiles**

📁 File: `supabase/migrations/005_add_photo_url_to_profiles.sql`

1. Copy all content
2. Paste into Supabase SQL Editor
3. Click **Run**
4. ✅ Should see: **Success. Rows updated**

**What it does:**
- Adds `photo_url` column to `discovery_profiles` table
- Creates function to randomly assign portrait photos
- Updates ALL 800 profiles with gender-appropriate photos
- 20 different photos per gender (avoids repetition)

---

#### **Migration 006: Gamification Achievements**

📁 File: `supabase/migrations/006_seed_achievements.sql`

1. Copy all content
2. Paste into Supabase SQL Editor
3. Click **Run**
4. ✅ Should see: **Success. 49 rows affected**

**What it does:**
- Populates `achievements` table with 49 achievements:
  - 🎨 Profile achievements (First Impression, Verified, etc.)
  - 💘 Matching achievements (It's a Match!, Heartbreaker, etc.)
  - 💬 Conversation achievements (Icebreaker, Chatterbox, etc.)
  - 🔥 Streak achievements (Committed, Unstoppable, etc.)
  - 💝 Engagement achievements (Gift Giver, Story Star, etc.)
  - 💎 Premium achievements (VIP, Supporter, etc.)
  - ⭐ Special achievements (Early Adopter, Perfect Match, etc.)

---

## 3️⃣ Verify Data

After running all migrations, verify in **Table Editor**:

### Check `discovery_profiles` table:

```sql
SELECT
    country,
    language,
    COUNT(*) as profile_count,
    COUNT(DISTINCT gender) as genders
FROM public.discovery_profiles
GROUP BY country, language
ORDER BY country;
```

**Expected result:**
```
USA        | en | 100 | 2
Czech Republic | cs | 100 | 2
Germany    | de | 100 | 2
France     | fr | 100 | 2
Spain      | es | 100 | 2
Italy      | it | 100 | 2
Poland     | pl | 100 | 2
Portugal   | pt | 100 | 2
```

### Check profile photos:

```sql
SELECT
    COUNT(*) as total_profiles,
    COUNT(photo_url) as profiles_with_photos
FROM public.discovery_profiles;
```

**Expected:** Both counts should be 800

### Check achievements:

```sql
SELECT
    category,
    COUNT(*) as achievement_count
FROM public.achievements
GROUP BY category
ORDER BY category;
```

**Expected:** 7 categories with varying counts

---

## 4️⃣ Test the App

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit app:**
   - Czech profiles: `http://localhost:8080/cs`
   - German profiles: `http://localhost:8080/de`
   - French profiles: `http://localhost:8080/fr`
   - English/USA: `http://localhost:8080/en`

3. **Expected behavior:**
   - Should see profiles loading from Supabase
   - Profiles match the selected language
   - Photos of real people (portraits)
   - Swipe through all 100 profiles for that country

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- **Problem:** Migration 001 wasn't run
- **Solution:** Run `001_add_app_features.sql` first

### Error: "duplicate key value violates unique constraint"
- **Problem:** You already ran this migration
- **Solution:** Skip to next migration OR delete existing data:
  ```sql
  DELETE FROM public.discovery_profiles;
  ```

### No profiles showing in app
- **Check 1:** Open browser console, look for errors
- **Check 2:** Verify `.env` has correct Supabase URL and anon key
- **Check 3:** Run this query:
  ```sql
  SELECT COUNT(*) FROM public.discovery_profiles;
  ```
  Should return 800

### Photos not loading
- **Problem:** Photo URLs may be blocked by CORS
- **Solution:** Unsplash should work, but if not, we can switch to different photo sources
- **Check:** Open browser DevTools → Network tab, look for failed image requests

### Wrong language profiles showing
- **Check:** URL in browser should be `/cs` for Czech, `/de` for German, etc.
- **Verify:** Check browser console for the language being passed to hook

---

## 📊 What's Next?

After successful migration, you have:

✅ **800 AI profiles** with localized names, bios, and photos
✅ **8 countries** with proper language/currency setup
✅ **49 gamification achievements** ready to unlock
✅ **React app connected** to Supabase (real data, not mock)

### Immediate Next Steps:

1. **Test profile discovery** - Swipe through profiles in different languages
2. **Implement delayed authentication** - Per your "odložené přihlašování" strategy
3. **Stripe integration** - For credits, gifts, and premium subscriptions
4. **Stories integration** - Connect Stories feature to real users
5. **Deploy to production** - Vercel or your preferred host

---

## 🔒 Security Note

**IMPORTANT:** Your service_role key was exposed in chat history. For production:

1. Go to [Supabase Settings → API](https://app.supabase.com/project/haayvhkovottszzdnzbz/settings/api)
2. Click **"Reset"** on the service_role key
3. **Never** use service_role key in frontend code (only use `anon` key)
4. Service role key is only for backend/admin operations

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **SQL Errors:** Check the error message in SQL Editor, it usually points to the exact line
- **Connection Issues:** Verify `.env` credentials match Supabase dashboard

Good luck! 🚀

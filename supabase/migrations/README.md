# 📚 Supabase Database Migrations

This directory contains SQL migration files for the Gem dating app.

## 🚀 How to Apply Migrations

### Option 1: Using Supabase CLI
```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply all pending migrations
supabase db push

# Or apply specific migration
supabase db push --include-all
```

### Option 2: Manual SQL Execution
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file (e.g., `010_update_professional_services_optin.sql`)
4. Copy the entire contents
5. Paste into SQL Editor
6. Click **Run** to execute

## 📋 Migration Files

| File | Description |
|------|-------------|
| `001_add_app_features.sql` | Initial database setup with core tables |
| `002_seed_profiles_part1_usa.sql` | Seed USA profiles |
| `003_seed_profiles_part2_czech.sql` | Seed Czech profiles |
| `004_seed_profiles_remaining_countries.sql` | Seed remaining country profiles |
| `005_add_photo_url_to_profiles.sql` | Add photo URLs to profiles |
| `006_seed_achievements.sql` | Seed gamification achievements |
| `007_credit_pricing_and_payouts.sql` | Credit system and payout structure |
| `008_fix_discovery_profiles_rls.sql` | Fix RLS policies for discovery |
| `009_add_personality_and_professional_category.sql` | Add SLM personality & professional categories |
| `010_update_professional_services_optin.sql` | ✨ **NEW** Update for opt-in professional services filter |

## 🆕 Latest Migration: 010

**Purpose**: Update professional services to use opt-in "Looking for Professional Services" filter

**Changes**:
- ✅ Ensures `personality_type` enum exists (10 personality types)
- ✅ Ensures `professional_category` enum exists (14 professional categories)
- ✅ Adds `personality`, `professional_category`, `ai_model_config` columns to `discovery_profiles`
- ✅ Creates indexes for efficient filtering
- ✅ Migrates existing occupation data to structured categories
- ✅ Sets up AI model configurations for personality-based chat
- ✅ Creates `professional_profiles` view for easy querying

**Professional Categories**:
- Therapist
- Couples Therapist
- Psychologist
- Couples Psychologist
- Coach
- Life Coach
- Fitness Coach
- Business Coach
- Sports Coach
- Nutritionist
- Counselor
- Psychiatrist
- Social Worker
- Other

**Personality Types**:
- Friendly
- Professional
- Flirty
- Intellectual
- Funny
- Romantic
- Adventurous
- Calm
- Energetic
- Mysterious

## 🔍 Filter Logic

The new "Looking for Professional Services" filter works as follows:

1. **Profiles are marked** with their `professional_category` (e.g., "therapist", "coach")
2. **Users opt-in** to search for professionals via the discovery filter
3. **Filter is positive** - "I'm looking for someone specific" (not exclusive)
4. **Non-stigmatizing** - No visible marker that someone is "excluded"

## 🧪 Testing

After applying migration 010, test:

1. ✅ Czech translations display correctly
2. ✅ Filter shows "Looking for Professional Services" instead of "Professional Categories"
3. ✅ All 8 languages have proper translations (en, cs, de, fr, es, it, pl, pt)
4. ✅ Professional profiles can be filtered
5. ✅ View `professional_profiles` returns correct results

## 🌐 Supported Languages

All translations added for:
- 🇬🇧 English (en)
- 🇨🇿 Czech (cs)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)
- 🇮🇹 Italian (it)
- 🇵🇱 Polish (pl)
- 🇵🇹 Portuguese (pt)

## 💡 Notes

- Migrations are designed to be **idempotent** (safe to run multiple times)
- Always backup your database before applying migrations
- Test in a development environment first
- Migration 010 includes both 008 and 009 logic to ensure all changes are applied

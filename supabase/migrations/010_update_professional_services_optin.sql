-- ========================================
-- 🔍 Update Professional Services to Opt-in Filter
-- ========================================
-- Migration: 010
-- Purpose: Update professional categories to support opt-in "Looking for Professional Services" filter
--
-- Key Changes:
-- - Professional category is now a marker on profiles (who they are)
-- - Filter logic uses this to help people FIND professionals
-- - Not exclusive - it's "I'm looking for a professional" not "exclude non-professionals"

BEGIN;

-- Ensure personality_type enum exists (from migration 009)
DO $$ BEGIN
    CREATE TYPE personality_type AS ENUM (
        'friendly',
        'professional',
        'flirty',
        'intellectual',
        'funny',
        'romantic',
        'adventurous',
        'calm',
        'energetic',
        'mysterious'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure professional_category enum exists (from migration 009)
DO $$ BEGIN
    CREATE TYPE professional_category AS ENUM (
        'therapist',
        'couples_therapist',
        'psychologist',
        'couples_psychologist',
        'coach',
        'life_coach',
        'fitness_coach',
        'business_coach',
        'sports_coach',
        'nutritionist',
        'counselor',
        'psychiatrist',
        'social_worker',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add columns if they don't exist
DO $$
BEGIN
    -- Add personality column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'discovery_profiles' AND column_name = 'personality'
    ) THEN
        ALTER TABLE public.discovery_profiles
            ADD COLUMN personality personality_type DEFAULT 'friendly';
    END IF;

    -- Add professional_category column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'discovery_profiles' AND column_name = 'professional_category'
    ) THEN
        ALTER TABLE public.discovery_profiles
            ADD COLUMN professional_category professional_category;
    END IF;

    -- Add ai_model_config column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'discovery_profiles' AND column_name = 'ai_model_config'
    ) THEN
        ALTER TABLE public.discovery_profiles
            ADD COLUMN ai_model_config JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Add comment for ai_model_config structure
COMMENT ON COLUMN public.discovery_profiles.ai_model_config IS
'JSON configuration for SLM model:
{
  "system_prompt": "Custom system prompt for this personality",
  "temperature": 0.7,
  "max_tokens": 150,
  "model_endpoint": "http://localhost:8000/v1/chat",
  "personality_traits": ["trait1", "trait2"],
  "conversation_style": "casual/formal/playful",
  "language_preference": "cs/en",
  "custom_params": {}
}';

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_discovery_professional_category
    ON public.discovery_profiles(professional_category);

CREATE INDEX IF NOT EXISTS idx_discovery_personality
    ON public.discovery_profiles(personality);

-- Update existing profiles with professional categories based on occupation text
-- (This is a best-effort mapping from text occupation to enum)
UPDATE public.discovery_profiles
SET professional_category = CASE
    WHEN LOWER(occupation) LIKE '%psycholog%' AND (LOWER(occupation) LIKE '%párov%' OR LOWER(occupation) LIKE '%couple%')
        THEN 'couples_psychologist'::professional_category
    WHEN LOWER(occupation) LIKE '%psycholog%'
        THEN 'psychologist'::professional_category
    WHEN LOWER(occupation) LIKE '%therapist%' OR LOWER(occupation) LIKE '%terapeut%'
        THEN 'therapist'::professional_category
    WHEN LOWER(occupation) LIKE '%coach%' OR LOWER(occupation) LIKE '%kouč%'
        THEN 'coach'::professional_category
    WHEN LOWER(occupation) LIKE '%fitness%' OR LOWER(occupation) LIKE '%trenér%'
        THEN 'fitness_coach'::professional_category
    WHEN LOWER(occupation) LIKE '%life coach%' OR LOWER(occupation) LIKE '%životní%'
        THEN 'life_coach'::professional_category
    WHEN LOWER(occupation) LIKE '%business%' OR LOWER(occupation) LIKE '%byznys%'
        THEN 'business_coach'::professional_category
    WHEN LOWER(occupation) LIKE '%sport%'
        THEN 'sports_coach'::professional_category
    WHEN LOWER(occupation) LIKE '%psychiatr%'
        THEN 'psychiatrist'::professional_category
    WHEN LOWER(occupation) LIKE '%counselor%' OR LOWER(occupation) LIKE '%poradce%'
        THEN 'counselor'::professional_category
    WHEN LOWER(occupation) LIKE '%nutrition%'
        THEN 'nutritionist'::professional_category
    WHEN LOWER(occupation) LIKE '%social worker%' OR LOWER(occupation) LIKE '%sociální%'
        THEN 'social_worker'::professional_category
    ELSE professional_category
END
WHERE occupation IS NOT NULL
  AND professional_category IS NULL;

-- Assign random personalities to AI profiles for variety (only if not already set)
UPDATE public.discovery_profiles
SET personality = (
    ARRAY[
        'friendly'::personality_type,
        'professional'::personality_type,
        'flirty'::personality_type,
        'intellectual'::personality_type,
        'funny'::personality_type,
        'romantic'::personality_type,
        'adventurous'::personality_type,
        'calm'::personality_type,
        'energetic'::personality_type,
        'mysterious'::personality_type
    ]
)[floor(random() * 10 + 1)]
WHERE is_ai_profile = true
  AND personality IS NULL;

-- Set default ai_model_config for AI profiles (only if not already configured)
UPDATE public.discovery_profiles
SET ai_model_config = jsonb_build_object(
    'system_prompt', 'You are a friendly and engaging person on a dating app. Respond naturally and show interest in getting to know the other person.',
    'temperature', 0.8,
    'max_tokens', 150,
    'model_endpoint', NULL,
    'personality_traits', jsonb_build_array('empathetic', 'curious', 'positive'),
    'conversation_style', 'casual',
    'language_preference', language
)
WHERE is_ai_profile = true
  AND (ai_model_config IS NULL OR ai_model_config = '{}'::jsonb);

-- Create a helpful view for filtering professionals
CREATE OR REPLACE VIEW professional_profiles AS
SELECT
    id,
    name,
    age,
    gender,
    country,
    city,
    occupation,
    bio,
    professional_category,
    personality,
    verified,
    last_seen
FROM public.discovery_profiles
WHERE professional_category IS NOT NULL
ORDER BY last_seen DESC;

-- Grant access to the view
GRANT SELECT ON professional_profiles TO authenticated;
GRANT SELECT ON professional_profiles TO anon;

COMMIT;

-- ========================================
-- 📋 Summary
-- ========================================
-- ✅ Added personality_type enum (10 types)
-- ✅ Added professional_category enum (14 types)
-- ✅ Added personality, professional_category, ai_model_config columns
-- ✅ Created indexes for efficient filtering
-- ✅ Migrated existing occupation data to professional_category
-- ✅ Set up AI model configs for personality-based chat
-- ✅ Created helpful view for professional profiles
--
-- Next steps:
-- 1. Run this migration in Supabase
-- 2. Test the "Looking for Professional Services" filter in the app
-- 3. Verify translations are working correctly

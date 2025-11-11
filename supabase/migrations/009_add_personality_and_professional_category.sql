-- ========================================
-- 🎭 Add Personality & Professional Category
-- ========================================
-- Migration: 009
-- Purpose: Add support for SLM personalities and structured professional categories

BEGIN;

-- Add personality_type enum
CREATE TYPE personality_type AS ENUM (
    'friendly',           -- Přátelská, kamarádská
    'professional',       -- Profesionální, formální
    'flirty',            -- Flirtující, koketní
    'intellectual',      -- Intelektuální, hloubavá
    'funny',             -- Vtipná, humorná
    'romantic',          -- Romantická
    'adventurous',       -- Dobrodružná
    'calm',              -- Klidná, vyrovnaná
    'energetic',         -- Energická, nadšená
    'mysterious'         -- Tajemná, záhadná
);

-- Add professional_category enum (matching types.ts)
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
    'other'              -- Pro ostatní profese
);

-- Add new columns to discovery_profiles
ALTER TABLE public.discovery_profiles
    ADD COLUMN personality personality_type DEFAULT 'friendly',
    ADD COLUMN professional_category professional_category,
    ADD COLUMN ai_model_config JSONB DEFAULT '{}'::jsonb;

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

-- Create index for filtering by professional category
CREATE INDEX idx_discovery_professional_category
    ON public.discovery_profiles(professional_category);

-- Create index for personality type
CREATE INDEX idx_discovery_personality
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
    WHEN LOWER(occupation) LIKE '%psychiatr%'
        THEN 'psychiatrist'::professional_category
    WHEN LOWER(occupation) LIKE '%counselor%' OR LOWER(occupation) LIKE '%poradce%'
        THEN 'counselor'::professional_category
    WHEN LOWER(occupation) LIKE '%nutrition%'
        THEN 'nutritionist'::professional_category
    WHEN LOWER(occupation) LIKE '%social worker%' OR LOWER(occupation) LIKE '%sociální%'
        THEN 'social_worker'::professional_category
    ELSE NULL
END
WHERE occupation IS NOT NULL;

-- Assign random personalities to AI profiles for variety
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
WHERE is_ai_profile = true;

-- Set default ai_model_config for AI profiles
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
WHERE is_ai_profile = true AND ai_model_config = '{}'::jsonb;

COMMIT;

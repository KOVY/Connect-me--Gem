-- ========================================
-- 🔓 FIX: Allow anonymous users to view discovery profiles
-- ========================================
-- Problem: Current policy only allows authenticated users to view profiles
-- Solution: Allow both authenticated AND anonymous (anon) users

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view discovery profiles" ON public.discovery_profiles;

-- Create new permissive policy for everyone (authenticated + anonymous)
CREATE POLICY "Anyone can view discovery profiles"
    ON public.discovery_profiles FOR SELECT
    USING (true);

-- Keep the update policy for authenticated users only
-- (already exists, no changes needed)

COMMIT;

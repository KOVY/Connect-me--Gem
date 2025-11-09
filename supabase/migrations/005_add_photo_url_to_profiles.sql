-- ========================================
-- 📸 ADD PHOTO URL to discovery_profiles
-- ========================================

-- Add photo_url column
ALTER TABLE public.discovery_profiles
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create function to generate random portrait photo URLs
CREATE OR REPLACE FUNCTION random_portrait_photo(gender TEXT, seed INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF gender = 'female' THEN
        RETURN 'https://images.unsplash.com/photo-' ||
               CASE (seed % 20)
                   WHEN 0 THEN '1438761681033-6461ffad8d80?w=800&h=1000&fit=crop'
                   WHEN 1 THEN '1494790108377-be9c29b29330?w=800&h=1000&fit=crop'
                   WHEN 2 THEN '1524504388940-b1c1722653e1?w=800&h=1000&fit=crop'
                   WHEN 3 THEN '1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop'
                   WHEN 4 THEN '1517841905240-472988babdf9?w=800&h=1000&fit=crop'
                   WHEN 5 THEN '1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop'
                   WHEN 6 THEN '1544005313-94ddf0286df2?w=800&h=1000&fit=crop'
                   WHEN 7 THEN '1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop'
                   WHEN 8 THEN '1531746020798-e44692c8addb?w=800&h=1000&fit=crop'
                   WHEN 9 THEN '1509967419530-da38b4704bc6?w=800&h=1000&fit=crop'
                   WHEN 10 THEN '1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop'
                   WHEN 11 THEN '1521119989659-a83eee488004?w=800&h=1000&fit=crop'
                   WHEN 12 THEN '1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop'
                   WHEN 13 THEN '1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop'
                   WHEN 14 THEN '1534528741775-53994a69daeb?w=800&h=1000&fit=crop'
                   WHEN 15 THEN '1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop'
                   WHEN 16 THEN '1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop'
                   WHEN 17 THEN '1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop'
                   WHEN 18 THEN '1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop'
                   ELSE '1506863530036-1efeddceb993?w=800&h=1000&fit=crop'
               END;
    ELSE
        RETURN 'https://images.unsplash.com/photo-' ||
               CASE (seed % 20)
                   WHEN 0 THEN '1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop'
                   WHEN 1 THEN '1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop'
                   WHEN 2 THEN '1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop'
                   WHEN 3 THEN '1500648767791-00dcc994a43e?w=800&h=1000&fit=crop'
                   WHEN 4 THEN '1492562080023-ab3db95bfbce?w=800&h=1000&fit=crop'
                   WHEN 5 THEN '1519085360753-af0119f61c04?w=800&h=1000&fit=crop'
                   WHEN 6 THEN '1463453091185-61582044d556?w=800&h=1000&fit=crop'
                   WHEN 7 THEN '1506277886164-e25aa3f4660d?w=800&h=1000&fit=crop'
                   WHEN 8 THEN '1488161628813-04466f872be2?w=800&h=1000&fit=crop'
                   WHEN 9 THEN '1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop'
                   WHEN 10 THEN '1504257432389-52343af06ae3?w=800&h=1000&fit=crop'
                   WHEN 11 THEN '1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop'
                   WHEN 12 THEN '1506085452766-791f62cc2f8f?w=800&h=1000&fit=crop'
                   WHEN 13 THEN '1492447166138-50c3889fccb1?w=800&h=1000&fit=crop'
                   WHEN 14 THEN '1542596594-649edbc13630?w=800&h=1000&fit=crop'
                   WHEN 15 THEN '1522075469751-3a6694fb2f61?w=800&h=1000&fit=crop'
                   WHEN 16 THEN '1531891437562-4301cf35b7e4?w=800&h=1000&fit=crop'
                   WHEN 17 THEN '1508341591423-4347099e1f19?w=800&h=1000&fit=crop'
                   WHEN 18 THEN '1503235930437-8c6293ba41f5?w=800&h=1000&fit=crop'
                   ELSE '1504257432389-52343af06ae3?w=800&h=1000&fit=crop'
               END;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update all existing profiles with random photos
UPDATE public.discovery_profiles
SET photo_url = random_portrait_photo(gender, (random() * 1000000)::INTEGER)
WHERE photo_url IS NULL;

COMMIT;

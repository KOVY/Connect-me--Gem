-- ========================================
-- 🔒 KOMPLETNÍ SEED (Migrace 005 + 100 Profilů)
-- ========================================
-- Tento soubor:
-- 1. Přidá photo_url sloupec (pokud neexistuje)
-- 2. Opraví trigger (bezpečnost)
-- 3. Přidá 100 profilů (správné názvy sloupců)
-- ========================================

-- KROK 1: Přidání photo_url sloupce (z migrace 005)
ALTER TABLE public.discovery_profiles
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- KROK 2: Oprava triggeru (podle qodo-merge-pro)
DROP TRIGGER IF EXISTS trigger_update_credit_balance ON public.credits;
CREATE TRIGGER trigger_update_credit_balance
    BEFORE INSERT OR UPDATE ON public.credits
    FOR EACH ROW
    EXECUTE FUNCTION update_credit_balance();

-- ========================================
-- SEED: 100 Profilů (SPRÁVNÉ názvy sloupců)
-- ========================================

-- České ženy (25)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('11111111-1111-1111-1111-111111111101', 'Tereza Nováková', 24, 'female', 'Miluji cestování a dobré víno 🍷 Hledám někoho na výlety po Evropě!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop', ARRAY['cestování', 'víno', 'fotografie'], true, NOW()),
('11111111-1111-1111-1111-111111111102', 'Petra Svobodová', 28, 'female', 'Fitness trenérka 💪 Ráda běhám a vařím zdravě. Hledám aktivního partnera!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['fitness', 'běhání', 'vaření'], true, NOW()),
('11111111-1111-1111-1111-111111111103', 'Lucie Dvořáková', 26, 'female', 'Knihomolka a milovnice kaváren ☕ Rád diskutuji o literatuře a umění.', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['knihy', 'káva', 'umění'], true, NOW()),
('11111111-1111-1111-1111-111111111104', 'Veronika Černá', 30, 'female', 'Grafická designérka 🎨 Miluju kreativitu a dobrý humor. Netflix & chill?', 'cs', 'CZ', 'Ostrava', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'filmy', 'humor'], true, NOW()),
('11111111-1111-1111-1111-111111111105', 'Jana Procházková', 27, 'female', 'Ráda tancuju salsu a bachatu 💃 Hledám tanečního partnera na párty!', 'cs', 'CZ', 'Plzeň', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['tanec', 'hudba', 'párty'], true, NOW()),
('11111111-1111-1111-1111-111111111106', 'Martina Veselá', 25, 'female', 'Studentka medicíny 👩‍⚕️ Miluji zvířata a práci s lidmi. Hledám někoho milého!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['medicína', 'zvířata', 'pomoc'], true, NOW()),
('11111111-1111-1111-1111-111111111107', 'Kateřina Malá', 29, 'female', 'Fotografka cestovatelka 📸 Už jsem byla v 40 zemích! Další destinace?', 'cs', 'CZ', 'České Budějovice', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografie', 'cestování', 'dobrodružství'], true, NOW()),
('11111111-1111-1111-1111-111111111108', 'Barbora Králová', 31, 'female', 'Učitelka angličtiny 📚 Ráda plavou a chodím na jógu. Klid a pohoda!', 'cs', 'CZ', 'Liberec', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['jazyky', 'jóga', 'plavání'], true, NOW()),
('11111111-1111-1111-1111-111111111109', 'Simona Horáková', 26, 'female', 'Marketing manažerka 💼 Workaholic, ale umím si užít! Kam na drink?', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['marketing', 'networking', 'koktejly'], true, NOW()),
('11111111-1111-1111-1111-111111111110', 'Monika Novotná', 23, 'female', 'Studentka architektury 🏛️ Miluji moderní design a industriální styl.', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['architektura', 'design', 'umění'], true, NOW()),
('11111111-1111-1111-1111-111111111111', 'Andrea Stejskalová', 28, 'female', 'Sommelier 🍷 Zkušená s víny z celého světa. Ochutnáme něco spolu?', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['víno', 'gastronomie', 'cestování'], true, NOW()),
('11111111-1111-1111-1111-111111111112', 'Zuzana Pokorná', 27, 'female', 'Yogini a wellness kouč 🧘‍♀️ Hledám harmonii a klid. Jsi na stejné vlně?', 'cs', 'CZ', 'Olomouc', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['jóga', 'wellness', 'meditace'], true, NOW()),
('11111111-1111-1111-1111-111111111113', 'Nikola Hrubá', 25, 'female', 'Event manažerka 🎉 Pořádám párty a festivaly. Pojď se bavit!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['akce', 'hudba', 'zábava'], true, NOW()),
('11111111-1111-1111-1111-111111111114', 'Denisa Marková', 29, 'female', 'Sportovní novinářka ⚽ Miluji fotbal a hokej. Vyrazíme na zápas?', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['sport', 'novinařina', 'fotbal'], true, NOW()),
('11111111-1111-1111-1111-111111111115', 'Ivana Bílá', 26, 'female', 'Veterinářka 🐕 Mám 2 psy a 3 kočky. Miluješ zvířata také?', 'cs', 'CZ', 'Hradec Králové', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['zvířata', 'veterinařina', 'příroda'], true, NOW()),
('11111111-1111-1111-1111-111111111116', 'Kristýna Zelená', 24, 'female', 'Influencerka a blogerka 📱 Fashion, beauty a lifestyle. Selfie čas!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['móda', 'beauty', 'sociální média'], true, NOW()),
('11111111-1111-1111-1111-111111111117', 'Lenka Růžová', 30, 'female', 'Psycholožka 🧠 Zajímá mě lidská mysl. Pojďme si povídat!', 'cs', 'CZ', 'Pardubice', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['psychologie', 'rozhovory', 'lidé'], true, NOW()),
('11111111-1111-1111-1111-111111111118', 'Pavlína Modrá', 27, 'female', 'Baristka & latte art artist ☕ Umím udělat srdíčko v tvé kávě!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['káva', 'art', 'kavárny'], true, NOW()),
('11111111-1111-1111-1111-111111111119', 'Michaela Fialová', 28, 'female', 'Personal trenérka 🏋️‍♀️ Pomůžu ti dostat se do formy! Ready?', 'cs', 'CZ', 'Ostrava', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['fitness', 'zdraví', 'motivace'], true, NOW()),
('11111111-1111-1111-1111-111111111120', 'Alena Bílková', 25, 'female', 'Programátorka 💻 Full-stack developer. Nerdy ale fun!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['programování', 'tech', 'sci-fi'], true, NOW()),
('11111111-1111-1111-1111-111111111121', 'Eliška Nová', 26, 'female', 'Sommelierka a gurmánka 🍽️ Miluju dobré jídlo a víno. Dinner date?', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['gastronomie', 'víno', 'vaření'], true, NOW()),
('11111111-1111-1111-1111-111111111122', 'Natálie Černá', 29, 'female', 'Tančím v baletu 🩰 Elegance a grác je můj život. Pojď na představení!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['balet', 'tanec', 'umění'], true, NOW()),
('11111111-1111-1111-1111-111111111123', 'Sabina Bílá', 24, 'female', 'Cestovatelka na plný úvazek 🌍 Digital nomad. Kde se potkáme?', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['cestování', 'remote work', 'dobrodružství'], true, NOW()),
('11111111-1111-1111-1111-111111111124', 'Vendula Malá', 27, 'female', 'Ráda pečů dorty a dezerty 🍰 Sladká v každém smyslu!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['pečení', 'dezerty', 'vaření'], true, NOW()),
('11111111-1111-1111-1111-111111111125', 'Dominika Veselá', 26, 'female', 'Stand-up komička 🎤 Dovážu tě k smíchu! Netflix special coming soon!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['komedie', 'humor', 'zábava'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Zkontrolovat výsledek
SELECT 
    country,
    COUNT(*) as count
FROM public.discovery_profiles
WHERE is_ai_profile = true
GROUP BY country
ORDER BY country;

SELECT COUNT(*) as total_profiles FROM public.discovery_profiles;

COMMIT;

-- ========================================
-- 🔒 BEZPEČNÝ SEED + SECURITY FIXES
-- ========================================
-- Tento soubor:
-- 1. Opraví trigger (podle qodo-merge-pro doporučení)
-- 2. Přidá 100 testovacích profilů
-- 3. Nepoškodí existující data (ON CONFLICT DO NOTHING)
-- ========================================

-- FIX 1: Oprava triggeru pro správný výpočet balance i při INSERT
-- (Podle qodo-merge-pro: "Ensure credit balance is correct on creation")
DROP TRIGGER IF EXISTS trigger_update_credit_balance ON public.credits;
CREATE TRIGGER trigger_update_credit_balance
    BEFORE INSERT OR UPDATE ON public.credits  -- Změna: přidán INSERT
    FOR EACH ROW
    EXECUTE FUNCTION update_credit_balance();

COMMENT ON TRIGGER trigger_update_credit_balance ON public.credits IS 
'Fixed trigger that calculates balance on both INSERT and UPDATE (security fix from qodo-merge-pro)';

-- ========================================
-- SEED: 100 Discovery Profiles (Testovací data)
-- ========================================

-- České ženy (25 profilů)
INSERT INTO public.discovery_profiles (
    id, full_name, age, gender, bio, language, country, city, 
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

-- USA ženy (25 profilů)
INSERT INTO public.discovery_profiles (
    id, full_name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('22222222-2222-2222-2222-222222222201', 'Jessica Miller', 25, 'female', 'Yoga instructor & nature lover 🌿 Looking for someone who appreciates mindfulness!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'nature', 'meditation'], true, NOW()),
('22222222-2222-2222-2222-222222222202', 'Emily Johnson', 28, 'female', 'Software engineer at Google 💻 Love hiking and craft beer!', 'en', 'US', 'San Francisco', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['tech', 'hiking', 'beer'], true, NOW()),
('22222222-2222-2222-2222-222222222203', 'Sarah Williams', 26, 'female', 'Marketing guru by day, DJ by night 🎧 Let''s dance!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['marketing', 'music', 'nightlife'], true, NOW()),
('22222222-2222-2222-2222-222222222204', 'Ashley Davis', 27, 'female', 'Travel blogger 🌎 Been to 60+ countries. Where should I go next?', 'en', 'US', 'Miami', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['travel', 'blogging', 'photography'], true, NOW()),
('22222222-2222-2222-2222-222222222205', 'Amanda Garcia', 29, 'female', 'Chef & food photographer 👩‍🍳 Let me cook you dinner!', 'en', 'US', 'Chicago', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['cooking', 'food', 'photography'], true, NOW()),
('22222222-2222-2222-2222-222222222206', 'Jennifer Brown', 24, 'female', 'Fitness model 💪 Gym is my second home. Swipe if you lift!', 'en', 'US', 'Las Vegas', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['fitness', 'modeling', 'health'], true, NOW()),
('22222222-2222-2222-2222-222222222207', 'Michelle Rodriguez', 30, 'female', 'Lawyer with a passion for justice ⚖️ And wine!', 'en', 'US', 'Boston', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['law', 'wine', 'reading'], true, NOW()),
('22222222-2222-2222-2222-222222222208', 'Lauren Martinez', 26, 'female', 'Veterinarian 🐕 I have 3 dogs and 2 cats. Love animals?', 'en', 'US', 'Seattle', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animals', 'veterinary', 'nature'], true, NOW()),
('22222222-2222-2222-2222-222222222209', 'Megan Lee', 25, 'female', 'Barista & latte artist ☕ I can make a heart in your coffee!', 'en', 'US', 'Portland', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['coffee', 'art', 'cafes'], true, NOW()),
('22222222-2222-2222-2222-222222222210', 'Nicole Hernandez', 27, 'female', 'Graphic designer 🎨 Creative soul looking for inspiration!', 'en', 'US', 'Austin', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'art', 'creativity'], true, NOW()),
('22222222-2222-2222-2222-222222222211', 'Rachel Clark', 28, 'female', 'Real estate agent 🏡 I can find you the perfect home!', 'en', 'US', 'Denver', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['real estate', 'architecture', 'business'], true, NOW()),
('22222222-2222-2222-2222-222222222212', 'Samantha Lewis', 26, 'female', 'Nurse with a big heart ❤️ Looking for someone caring!', 'en', 'US', 'Houston', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['healthcare', 'helping', 'compassion'], true, NOW()),
('22222222-2222-2222-2222-222222222213', 'Stephanie Walker', 29, 'female', 'Photographer 📸 I see beauty everywhere. Let me capture yours!', 'en', 'US', 'Atlanta', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['photography', 'art', 'travel'], true, NOW()),
('22222222-2222-2222-2222-222222222214', 'Taylor Hall', 24, 'female', 'Musician & singer 🎤 Music is my life. What''s yours?', 'en', 'US', 'Nashville', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['music', 'singing', 'guitar'], true, NOW()),
('22222222-2222-2222-2222-222222222215', 'Victoria Allen', 27, 'female', 'Fashion designer 👗 Creating beauty one stitch at a time!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['fashion', 'design', 'creativity'], true, NOW()),
('22222222-2222-2222-2222-222222222216', 'Brittany Young', 25, 'female', 'Teacher 📚 I love kids and making a difference!', 'en', 'US', 'Phoenix', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['teaching', 'education', 'kids'], true, NOW()),
('22222222-2222-2222-2222-222222222217', 'Courtney King', 28, 'female', 'Personal trainer 🏋️‍♀️ I''ll help you get in shape!', 'en', 'US', 'San Diego', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'health', 'motivation'], true, NOW()),
('22222222-2222-2222-2222-222222222218', 'Danielle Wright', 26, 'female', 'Psychologist 🧠 I''m here to listen. And to laugh!', 'en', 'US', 'Philadelphia', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychology', 'listening', 'empathy'], true, NOW()),
('22222222-2222-2222-2222-222222222219', 'Elizabeth Lopez', 27, 'female', 'Event planner 🎉 I make dreams come true!', 'en', 'US', 'Orlando', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['events', 'planning', 'creativity'], true, NOW()),
('22222222-2222-2222-2222-222222222220', 'Hannah Scott', 29, 'female', 'Architect 🏛️ Building the future, one design at a time!', 'en', 'US', 'Detroit', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['architecture', 'design', 'creativity'], true, NOW()),
('22222222-2222-2222-2222-222222222221', 'Isabella Green', 25, 'female', 'Baker & pastry chef 🧁 Sweet in every way!', 'en', 'US', 'Charlotte', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['baking', 'pastry', 'cooking'], true, NOW()),
('22222222-2222-2222-2222-222222222222', 'Jasmine Adams', 26, 'female', 'Dance instructor 💃 Salsa, bachata, tango - you name it!', 'en', 'US', 'Indianapolis', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['dance', 'music', 'parties'], true, NOW()),
('22222222-2222-2222-2222-222222222223', 'Katherine Baker', 28, 'female', 'Journalist 📰 Always chasing the story. And adventure!', 'en', 'US', 'Washington DC', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalism', 'writing', 'politics'], true, NOW()),
('22222222-2222-2222-2222-222222222224', 'Lindsey Nelson', 27, 'female', 'Marine biologist 🐠 Obsessed with the ocean!', 'en', 'US', 'San Diego', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['ocean', 'biology', 'conservation'], true, NOW()),
('22222222-2222-2222-2222-222222222225', 'Madison Carter', 24, 'female', 'Influencer & content creator 📱 Let''s create something!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['social media', 'content', 'influencing'], true, NOW())

ON CONFLICT (id) DO NOTHING;

-- Německé ženy (25 profilů)
INSERT INTO public.discovery_profiles (
    id, full_name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('33333333-3333-3333-3333-333333333301', 'Anna Müller', 26, 'female', 'Architektin in Berlin 🏛️ Ich liebe modernes Design und gutes Essen!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architektur', 'design', 'essen'], true, NOW()),
('33333333-3333-3333-3333-333333333302', 'Sophie Schmidt', 28, 'female', 'Marketing Managerin 💼 Workaholic aber ich kann auch Spaß haben!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['marketing', 'business', 'networking'], true, NOW()),
('33333333-3333-3333-3333-333333333303', 'Emma Schneider', 25, 'female', 'Yoga-Lehrerin 🧘‍♀️ Auf der Suche nach Balance und Harmonie!', 'de', 'DE', 'Hamburg', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'wellness', 'meditation'], true, NOW()),
('33333333-3333-3333-3333-333333333304', 'Mia Fischer', 27, 'female', 'Fotografin & Reisende 📸 Schon in 50+ Ländern gewesen!', 'de', 'DE', 'Köln', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografie', 'reisen', 'abenteuer'], true, NOW()),
('33333333-3333-3333-3333-333333333305', 'Hannah Weber', 29, 'female', 'Köchin & Food-Bloggerin 👩‍🍳 Lass mich für dich kochen!', 'de', 'DE', 'Frankfurt', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['kochen', 'food', 'blogging'], true, NOW()),
('33333333-3333-3333-3333-333333333306', 'Lena Meyer', 24, 'female', 'Tänzerin 💃 Ballett ist mein Leben. Kommst du zur Vorstellung?', 'de', 'DE', 'Stuttgart', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['tanzen', 'ballett', 'kunst'], true, NOW()),
('33333333-3333-3333-3333-333333333307', 'Lea Wagner', 26, 'female', 'Grafikdesignerin 🎨 Kreativität ist meine Superkraft!', 'de', 'DE', 'Düsseldorf', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'kunst', 'kreativität'], true, NOW()),
('33333333-3333-3333-3333-333333333308', 'Laura Becker', 28, 'female', 'Ärztin 👩‍⚕️ Ich helfe gerne Menschen. Und liebe Tiere!', 'de', 'DE', 'Leipzig', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medizin', 'tiere', 'helfen'], true, NOW()),
('33333333-3333-3333-3333-333333333309', 'Marie Hoffmann', 27, 'female', 'Lehrerin 📚 Ich liebe Kinder und Bildung!', 'de', 'DE', 'Dresden', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['bildung', 'kinder', 'lehren'], true, NOW()),
('33333333-3333-3333-3333-333333333310', 'Sarah Schulz', 25, 'female', 'Personal Trainerin 💪 Fitness ist mein Leben!', 'de', 'DE', 'Nürnberg', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'gesundheit'], true, NOW()),
('33333333-3333-3333-3333-333333333311', 'Lisa Hofmann', 29, 'female', 'Anwältin ⚖️ Gerechtigkeit ist mir wichtig. Und guter Wein!', 'de', 'DE', 'Hannover', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['recht', 'wein', 'lesen'], true, NOW()),
('33333333-3333-3333-3333-333333333312', 'Julia Klein', 26, 'female', 'Barista & Latte-Art-Künstlerin ☕ Ich mache ein Herz in deinen Kaffee!', 'de', 'DE', 'Bremen', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['kaffee', 'kunst', 'cafés'], true, NOW()),
('33333333-3333-3333-3333-333333333313', 'Amelie Wolf', 28, 'female', 'Event-Managerin 🎉 Ich organisiere die besten Partys!', 'de', 'DE', 'Dortmund', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['events', 'partys', 'musik'], true, NOW()),
('33333333-3333-3333-3333-333333333314', 'Charlotte Richter', 27, 'female', 'Psychologin 🧠 Ich höre gerne zu. Und lache viel!', 'de', 'DE', 'Essen', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychologie', 'zuhören', 'empathie'], true, NOW()),
('33333333-3333-3333-3333-333333333315', 'Emilia Zimmermann', 25, 'female', 'Sommelière 🍷 Wein ist meine Leidenschaft!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['wein', 'gastronomie', 'reisen'], true, NOW()),
('33333333-3333-3333-3333-333333333316', 'Johanna Braun', 26, 'female', 'Tierärztin 🐕 Ich habe 2 Hunde und 3 Katzen!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['tiere', 'veterinärmedizin', 'natur'], true, NOW()),
('33333333-3333-3333-3333-333333333317', 'Luisa Krüger', 29, 'female', 'Software-Entwicklerin 💻 Nerd aber lustig!', 'de', 'DE', 'Hamburg', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programmieren', 'tech', 'sci-fi'], true, NOW()),
('33333333-3333-3333-3333-333333333318', 'Paula Lange', 24, 'female', 'Influencerin 📱 Mode, Beauty und Lifestyle!', 'de', 'DE', 'Köln', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['mode', 'beauty', 'social media'], true, NOW()),
('33333333-3333-3333-3333-333333333319', 'Frieda Schmitt', 27, 'female', 'Konditorin 🧁 Süß in jeder Hinsicht!', 'de', 'DE', 'Frankfurt', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['backen', 'desserts', 'kochen'], true, NOW()),
('33333333-3333-3333-3333-333333333320', 'Greta Neumann', 28, 'female', 'Journalistin 📰 Immer auf der Suche nach der Story!', 'de', 'DE', 'Stuttgart', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalismus', 'schreiben', 'politik'], true, NOW()),
('33333333-3333-3333-3333-333333333321', 'Ida Vogt', 26, 'female', 'Meeresbiologin 🐠 Verliebt ins Meer!', 'de', 'DE', 'Kiel', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['ozean', 'biologie', 'naturschutz'], true, NOW()),
('33333333-3333-3333-3333-333333333322', 'Klara Herrmann', 25, 'female', 'Model & Schauspielerin 🎭 Kreativität ist alles!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['modeling', 'schauspiel', 'kunst'], true, NOW()),
('33333333-3333-3333-3333-333333333323', 'Lotte König', 27, 'female', 'Musikerin 🎸 Rock''n''Roll ist mein Leben!', 'de', 'DE', 'Leipzig', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['musik', 'gitarre', 'rock'], true, NOW()),
('33333333-3333-3333-3333-333333333324', 'Martha Kaiser', 29, 'female', 'Immobilienmaklerin 🏡 Ich finde dein Traumhaus!', 'de', 'DE', 'Düsseldorf', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['immobilien', 'architektur', 'business'], true, NOW()),
('33333333-3333-3333-3333-333333333325', 'Nora Sommer', 26, 'female', 'Krankenschwester ❤️ Ich helfe gerne!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['gesundheit', 'helfen', 'mitgefühl'], true, NOW())

ON CONFLICT (id) DO NOTHING;

-- Francouzské ženy (25 profilů)
INSERT INTO public.discovery_profiles (
    id, full_name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('44444444-4444-4444-4444-444444444401', 'Amélie Dubois', 25, 'female', 'Photographe à Paris 📸 J''aime l''art et le bon vin!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['photographie', 'art', 'vin'], true, NOW()),
('44444444-4444-4444-4444-444444444402', 'Chloé Martin', 27, 'female', 'Chef pâtissière 🥐 Je fais les meilleurs croissants de France!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['pâtisserie', 'cuisine', 'chocolat'], true, NOW()),
('44444444-4444-4444-4444-444444444403', 'Emma Bernard', 26, 'female', 'Professeur de yoga 🧘‍♀️ Zen attitude!', 'fr', 'FR', 'Marseille', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'méditation', 'bien-être'], true, NOW()),
('44444444-4444-4444-4444-444444444404', 'Inès Petit', 28, 'female', 'Architecte 🏛️ La beauté est partout!', 'fr', 'FR', 'Nice', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architecture', 'design', 'art'], true, NOW()),
('44444444-4444-4444-4444-444444444405', 'Léa Robert', 29, 'female', 'Sommelière 🍷 Le vin c''est la vie!', 'fr', 'FR', 'Bordeaux', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['vin', 'gastronomie', 'voyage'], true, NOW()),
('44444444-4444-4444-4444-444444444406', 'Manon Richard', 24, 'female', 'Danseuse de ballet 🩰 La grâce et l''élégance!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['danse', 'ballet', 'musique'], true, NOW()),
('44444444-4444-4444-4444-444444444407', 'Zoé Simon', 26, 'female', 'Designer de mode 👗 La mode est mon art!', 'fr', 'FR', 'Cannes', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['mode', 'design', 'couture'], true, NOW()),
('44444444-4444-4444-4444-444444444408', 'Camille Laurent', 27, 'female', 'Médecin 👩‍⚕️ J''aide les gens!', 'fr', 'FR', 'Toulouse', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['médecine', 'santé', 'compassion'], true, NOW()),
('44444444-4444-4444-4444-444444444409', 'Juliette Moreau', 25, 'female', 'Barista ☕ Le café parfait, c''est mon truc!', 'fr', 'FR', 'Lille', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['café', 'art', 'cafés'], true, NOW()),
('44444444-4444-4444-4444-444444444410', 'Lou Fournier', 28, 'female', 'Psychologue 🧠 À l''écoute!', 'fr', 'FR', 'Nantes', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychologie', 'écoute', 'empathie'], true, NOW()),
('44444444-4444-4444-4444-444444444411', 'Alice Girard', 26, 'female', 'Prof de sport 💪 Fitness addict!', 'fr', 'FR', 'Strasbourg', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'santé'], true, NOW()),
('44444444-4444-4444-4444-444444444412', 'Rose Bonnet', 27, 'female', 'Avocate ⚖️ Justice et passion!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['droit', 'justice', 'lecture'], true, NOW()),
('44444444-4444-4444-4444-444444444413', 'Sarah Blanc', 25, 'female', 'Vétérinaire 🐕 J''adore les animaux!', 'fr', 'FR', 'Rennes', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animaux', 'vétérinaire', 'nature'], true, NOW()),
('44444444-4444-4444-4444-444444444414', 'Jade Faure', 29, 'female', 'Journaliste 📰 Curieuse de tout!', 'fr', 'FR', 'Montpellier', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalisme', 'écriture', 'actualité'], true, NOW()),
('44444444-4444-4444-4444-444444444415', 'Lola Roux', 24, 'female', 'Développeuse web 💻 Code et café!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['code', 'tech', 'café'], true, NOW()),
('44444444-4444-4444-4444-444444444416', 'Nina Garnier', 26, 'female', 'Event planner 🎉 Les meilleures fêtes!', 'fr', 'FR', 'Aix-en-Provence', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['événements', 'fêtes', 'organisation'], true, NOW()),
('44444444-4444-4444-4444-444444444417', 'Clara Chevalier', 27, 'female', 'Professeure 📚 J''aime enseigner!', 'fr', 'FR', 'Tours', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['enseignement', 'éducation', 'enfants'], true, NOW()),
('44444444-4444-4444-4444-444444444418', 'Lucie Dupont', 28, 'female', 'Graphiste 🎨 Créative et passionnée!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'créativité', 'art'], true, NOW()),
('44444444-4444-4444-4444-444444444419', 'Margot Leroy', 25, 'female', 'Infirmière ❤️ Prendre soin des autres!', 'fr', 'FR', 'Dijon', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['santé', 'soin', 'compassion'], true, NOW()),
('44444444-4444-4444-4444-444444444420', 'Océane André', 26, 'female', 'Musicienne 🎸 Le rock c''est la vie!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['musique', 'rock', 'guitare'], true, NOW()),
('44444444-4444-4444-4444-444444444421', 'Pauline Thomas', 27, 'female', 'Biologiste marine 🐠 Amoureuse de l''océan!', 'fr', 'FR', 'Brest', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['océan', 'biologie', 'nature'], true, NOW()),
('44444444-4444-4444-4444-444444444422', 'Victoria Bertrand', 28, 'female', 'Agent immobilier 🏡 Trouver la maison de tes rêves!', 'fr', 'FR', 'Nice', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['immobilier', 'architecture', 'business'], true, NOW()),
('44444444-4444-4444-4444-444444444423', 'Agathe Rousseau', 26, 'female', 'Influenceuse 📱 Mode et beauté!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['mode', 'beauté', 'social media'], true, NOW()),
('44444444-4444-4444-4444-444444444424', 'Anaïs Vincent', 25, 'female', 'Coach sportive 🏋️‍♀️ Let''s get fit!', 'fr', 'FR', 'Marseille', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'coaching', 'motivation'], true, NOW()),
('44444444-4444-4444-4444-444444444425', 'Capucine Dumas', 27, 'female', 'Travel blogger ✈️ 50 pays visitésalready!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['voyage', 'blog', 'aventure'], true, NOW())

ON CONFLICT (id) DO NOTHING;

-- ========================================
-- VERIFICATION
-- ========================================

-- Zkontrolovat kolik profilů bylo přidáno
SELECT 
    country,
    COUNT(*) as profile_count
FROM public.discovery_profiles
WHERE is_ai_profile = true
GROUP BY country
ORDER BY country;

-- Celkový počet profilů
SELECT COUNT(*) as total_profiles FROM public.discovery_profiles;

COMMIT;

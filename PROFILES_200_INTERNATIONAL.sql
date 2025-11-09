-- ========================================
-- 🌍 200 MEZINÁRODNÍCH PROFILŮ
-- Pro všechny locale prefixy: cs-cz, en-us, de-de, fr-fr, es-es, it-it, pl-pl, pt-pt
-- ========================================

-- 🇨🇿 ČESKO - České ženy (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'Karolína Nováková', 25, 'female', 'Miluju jógu a zdravý životní styl 🧘‍♀️ Hledám někoho klidného a vyrovnaného.', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop', ARRAY['jóga', 'wellness', 'zdraví'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', 'Adéla Svobodová', 27, 'female', 'Fotografka a cestovatelka 📸 Už jsem navštívila 35 zemí!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['fotografie', 'cestování', 'příroda'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', 'Klára Málková', 29, 'female', 'Sommelier a milovnice dobrého jídla 🍷 Wine & dine?', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['víno', 'gastronomie', 'vaření'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', 'Barbora Horáková', 24, 'female', 'Architektka s láskou k modernímu designu 🏛️', 'cs', 'CZ', 'Ostrava', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['architektura', 'design', 'umění'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', 'Veronika Černá', 26, 'female', 'Tančím salsu každý víkend 💃 Pojď se mnou!', 'cs', 'CZ', 'Plzeň', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['tanec', 'salsa', 'latina'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa006', 'Michaela Veselá', 28, 'female', 'Pediatrička 👩‍⚕️ Miluju děti a zvířata!', 'cs', 'CZ', 'České Budějovice', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['medicína', 'děti', 'zvířata'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa007', 'Nikola Dvořáková', 30, 'female', 'Běhám maratony a miluji adrenalin 🏃‍♀️', 'cs', 'CZ', 'Liberec', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['běhání', 'sport', 'fitness'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa008', 'Tereza Procházková', 23, 'female', 'Grafická designérka 🎨 Kreativita je můj život!', 'cs', 'CZ', 'Pardubice', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['design', 'art', 'kreativita'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa009', 'Kristýna Marková', 27, 'female', 'Marketingová manažerka 💼 Pracuji tvrdě, bavím se ještě tvrději!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['marketing', 'business', 'networking'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa010', 'Simona Králová', 25, 'female', 'Studentka práv ⚖️ Spravedlnost je má vášeň!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['právo', 'politika', 'čtení'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa011', 'Lucie Nová', 29, 'female', 'Personal trenérka 💪 Pomůžu ti změnit život!', 'cs', 'CZ', 'Olomouc', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['fitness', 'zdraví', 'motivace'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa012', 'Jana Malá', 26, 'female', 'Baristka a latte art umělkyně ☕', 'cs', 'CZ', 'Hradec Králové', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['káva', 'art', 'barista'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa013', 'Eva Černá', 24, 'female', 'Psycholožka 🧠 Ráda naslouchám!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['psychologie', 'meditace', 'mindfulness'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa014', 'Petra Bílá', 28, 'female', 'Veterinářka 🐕 Mám 4 psy!', 'cs', 'CZ', 'Zlín', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['zvířata', 'veterina', 'příroda'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa015', 'Denisa Růžová', 27, 'female', 'Event manažerka 🎉 Pořádám nejlepší akce!', 'cs', 'CZ', 'Ostrava', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['eventy', 'hudba', 'párty'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa016', 'Markéta Zelená', 25, 'female', 'Influencerka 📱 Fashion & beauty!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['móda', 'beauty', 'instagram'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa017', 'Lenka Fialová', 30, 'female', 'Učitelka mateřské školy 👶 Miluju děti!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['vzdělávání', 'děti', 'kreativita'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa018', 'Pavlína Modrá', 26, 'female', 'Baletka 🩰 Grác a elegance!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['balet', 'tanec', 'umění'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa019', 'Andrea Nováková', 29, 'female', 'Novinářka 📰 Hledám pravdu!', 'cs', 'CZ', 'Plzeň', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['žurnalistika', 'psaní', 'investigace'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa020', 'Zuzana Bílková', 24, 'female', 'Programátorka 💻 Python & JavaScript!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['programování', 'tech', 'AI'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa021', 'Hana Černá', 28, 'female', 'Konditorka 🧁 Sladkosti jsou moje vášeň!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['pečení', 'cukrářství', 'dezerty'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa022', 'Ivana Veselá', 27, 'female', 'Pilotka ✈️ Miluji svobodu!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['létání', 'cestování', 'adrenalin'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa023', 'Martina Svobodová', 25, 'female', 'Mořská bioložka 🐠 Oceán je můj domov!', 'cs', 'CZ', 'Ostrava', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['biologie', 'oceán', 'ekologie'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa024', 'Kateřina Malá', 26, 'female', 'Realitní makléřka 🏡 Najdu ti sen!', 'cs', 'CZ', 'Brno', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['reality', 'business', 'architektura'], true, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa025', 'Dominika Nová', 29, 'female', 'Muzikantka 🎸 Rock je v mé krvi!', 'cs', 'CZ', 'Praha', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['hudba', 'kytara', 'rock'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 🇺🇸 USA - Americké ženy (50 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'Emma Thompson', 25, 'female', 'Yoga teacher & wellness coach 🧘‍♀️ Namaste!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'wellness', 'meditation'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'Olivia Martinez', 28, 'female', 'Software engineer at Apple 💻 Love coding!', 'en', 'US', 'San Francisco', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['coding', 'tech', 'AI'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'Sophia Anderson', 26, 'female', 'Marketing director 💼 Passionate about branding!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['marketing', 'branding', 'business'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'Isabella Garcia', 27, 'female', 'Travel vlogger 🌎 60+ countries visited!', 'en', 'US', 'Miami', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['travel', 'vlogging', 'adventure'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'Mia Rodriguez', 29, 'female', 'Chef & food blogger 👩‍🍳 Culinary artist!', 'en', 'US', 'Chicago', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['cooking', 'food', 'blogging'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb06', 'Charlotte Brown', 24, 'female', 'Fitness model 💪 Train hard, live harder!', 'en', 'US', 'Las Vegas', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['fitness', 'modeling', 'gym'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb07', 'Amelia Davis', 30, 'female', 'Lawyer ⚖️ Justice is my passion!', 'en', 'US', 'Boston', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['law', 'justice', 'politics'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb08', 'Harper Wilson', 26, 'female', 'Veterinarian 🐕 Animal lover!', 'en', 'US', 'Seattle', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animals', 'veterinary', 'nature'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb09', 'Evelyn Moore', 25, 'female', 'Barista & latte artist ☕ Coffee is life!', 'en', 'US', 'Portland', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['coffee', 'art', 'cafes'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10', 'Abigail Taylor', 27, 'female', 'Graphic designer 🎨 Creative mind!', 'en', 'US', 'Austin', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'art', 'creativity'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', 'Emily Thomas', 28, 'female', 'Real estate agent 🏡 Dream home finder!', 'en', 'US', 'Denver', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['real estate', 'business', 'homes'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb12', 'Elizabeth Jackson', 26, 'female', 'Nurse ❤️ Caring is my calling!', 'en', 'US', 'Houston', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['healthcare', 'nursing', 'compassion'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb13', 'Avery White', 29, 'female', 'Photographer 📸 Capturing moments!', 'en', 'US', 'Atlanta', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['photography', 'art', 'travel'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb14', 'Ella Harris', 24, 'female', 'Singer & songwriter 🎤 Music is everything!', 'en', 'US', 'Nashville', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['music', 'singing', 'songwriting'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb15', 'Scarlett Martin', 27, 'female', 'Fashion designer 👗 Style icon!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['fashion', 'design', 'style'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb16', 'Victoria Lee', 25, 'female', 'Teacher 📚 Shaping futures!', 'en', 'US', 'Phoenix', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['teaching', 'education', 'kids'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb17', 'Grace Walker', 28, 'female', 'Personal trainer 🏋️‍♀️ Get fit!', 'en', 'US', 'San Diego', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'training', 'health'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb18', 'Chloe Hall', 26, 'female', 'Psychologist 🧠 Mental health advocate!', 'en', 'US', 'Philadelphia', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychology', 'therapy', 'wellness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb19', 'Penelope Allen', 27, 'female', 'Event planner 🎉 Party expert!', 'en', 'US', 'Orlando', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['events', 'planning', 'parties'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb20', 'Layla Young', 29, 'female', 'Architect 🏛️ Building dreams!', 'en', 'US', 'Detroit', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['architecture', 'design', 'buildings'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb21', 'Riley King', 25, 'female', 'Pastry chef 🧁 Sweet creations!', 'en', 'US', 'Charlotte', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['baking', 'pastry', 'desserts'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb22', 'Zoey Scott', 26, 'female', 'Dance instructor 💃 Salsa & bachata!', 'en', 'US', 'Indianapolis', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['dance', 'salsa', 'latin'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb23', 'Nora Green', 28, 'female', 'Journalist 📰 Truth seeker!', 'en', 'US', 'Washington DC', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalism', 'writing', 'news'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb24', 'Lillian Adams', 27, 'female', 'Marine biologist 🐠 Ocean lover!', 'en', 'US', 'San Diego', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['ocean', 'biology', 'conservation'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb25', 'Hannah Baker', 24, 'female', 'Influencer 📱 Content creator!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['influencing', 'content', 'social media'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb26', 'Addison Nelson', 30, 'female', 'Sommelier 🍷 Wine expert!', 'en', 'US', 'Napa Valley', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['wine', 'sommelier', 'gastronomy'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb27', 'Aubrey Carter', 25, 'female', 'Pilot ✈️ Sky is my home!', 'en', 'US', 'Dallas', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['flying', 'aviation', 'travel'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb28', 'Brooklyn Mitchell', 27, 'female', 'Entrepreneur 💼 Building my empire!', 'en', 'US', 'Silicon Valley', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['business', 'startup', 'tech'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb29', 'Savannah Perez', 26, 'female', 'Makeup artist 💄 Beauty specialist!', 'en', 'US', 'Miami', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['makeup', 'beauty', 'fashion'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb30', 'Audrey Roberts', 28, 'female', 'HR manager 👔 People person!', 'en', 'US', 'Chicago', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['HR', 'recruiting', 'people'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb31', 'Claire Turner', 29, 'female', 'Ballet dancer 🩰 Grace and passion!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['ballet', 'dance', 'performance'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb32', 'Lucy Phillips', 24, 'female', 'Data scientist 📊 AI enthusiast!', 'en', 'US', 'Boston', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['data science', 'AI', 'analytics'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb33', 'Anna Campbell', 26, 'female', 'Florist 🌸 Creating beauty!', 'en', 'US', 'Portland', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['flowers', 'nature', 'art'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb34', 'Caroline Parker', 27, 'female', 'Yoga instructor 🧘‍♀️ Mind & body!', 'en', 'US', 'Boulder', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'mindfulness', 'wellness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb35', 'Genesis Evans', 25, 'female', 'Interior designer 🏠 Creating spaces!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['interior design', 'decor', 'homes'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb36', 'Skylar Edwards', 28, 'female', 'Dentist 🦷 Bright smiles!', 'en', 'US', 'Denver', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['dentistry', 'healthcare', 'wellness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb37', 'Bella Collins', 26, 'female', 'Book editor 📖 Literature lover!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['books', 'editing', 'literature'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb38', 'Aria Stewart', 27, 'female', 'Pharmacist 💊 Health advocate!', 'en', 'US', 'Houston', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['pharmacy', 'healthcare', 'science'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb39', 'Ellie Sanchez', 29, 'female', 'Life coach 🌟 Empowering others!', 'en', 'US', 'Austin', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['coaching', 'motivation', 'growth'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb40', 'Paisley Morris', 25, 'female', 'Environmental scientist 🌱 Save Earth!', 'en', 'US', 'Seattle', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['environment', 'sustainability', 'ecology'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb41', 'Aaliyah Rogers', 26, 'female', 'Podcast host 🎙️ Great conversations!', 'en', 'US', 'San Francisco', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['podcasting', 'media', 'communication'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb42', 'Kennedy Reed', 28, 'female', 'Nutritionist 🥗 Healthy living!', 'en', 'US', 'Miami', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['nutrition', 'health', 'wellness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb43', 'Madelyn Cook', 27, 'female', 'UX designer 💻 User experience!', 'en', 'US', 'San Diego', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['UX design', 'tech', 'creativity'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb44', 'Madeline Bell', 24, 'female', 'Yoga retreat organizer 🌴 Peace & zen!', 'en', 'US', 'Hawaii', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'retreats', 'travel'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb45', 'Quinn Murphy', 29, 'female', 'Financial advisor 💰 Wealth builder!', 'en', 'US', 'Wall Street', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['finance', 'investing', 'business'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb46', 'Naomi Rivera', 25, 'female', 'Tattoo artist 🎨 Body art expert!', 'en', 'US', 'Portland', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['tattoos', 'art', 'creativity'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb47', 'Serenity Cooper', 26, 'female', 'Meditation teacher 🧘 Inner peace!', 'en', 'US', 'Boulder', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['meditation', 'spirituality', 'wellness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb48', 'Ariana Richardson', 27, 'female', 'Music producer 🎵 Beat maker!', 'en', 'US', 'Los Angeles', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['music', 'production', 'beats'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb49', 'Elena Cox', 28, 'female', 'Sports coach ⚽ Team player!', 'en', 'US', 'Chicago', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['sports', 'coaching', 'fitness'], true, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb50', 'Ivy Howard', 30, 'female', 'Art curator 🖼️ Gallery expert!', 'en', 'US', 'New York', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['art', 'galleries', 'culture'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Zobrazit výsledek
SELECT 
    country,
    language,
    COUNT(*) as count
FROM public.discovery_profiles
WHERE is_ai_profile = true
AND id LIKE 'aaaaaaaa-%' OR id LIKE 'bbbbbbbb-%'
GROUP BY country, language
ORDER BY country, language;

SELECT COUNT(*) as new_profiles_added 
FROM public.discovery_profiles 
WHERE id LIKE 'aaaaaaaa-%' OR id LIKE 'bbbbbbbb-%';

COMMIT;

-- 🇩🇪 NĚMECKO - Deutsche Frauen (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'Anna Müller', 26, 'female', 'Architektin in Berlin 🏛️ Moderne Designs sind meine Leidenschaft!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architektur', 'design', 'kunst'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc02', 'Sophie Weber', 28, 'female', 'Marketing Managerin 💼 Kreativ und ambitioniert!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['marketing', 'business', 'kreativität'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc03', 'Emma Schneider', 25, 'female', 'Yoga-Lehrerin 🧘‍♀️ Balance und Harmonie!', 'de', 'DE', 'Hamburg', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'wellness', 'meditation'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc04', 'Mia Fischer', 27, 'female', 'Fotografin 📸 Die Welt durch meine Linse!', 'de', 'DE', 'Köln', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografie', 'reisen', 'kunst'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc05', 'Hannah Schmidt', 29, 'female', 'Köchin & Food-Bloggerin 👩‍🍳 Leidenschaftlich!', 'de', 'DE', 'Frankfurt', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['kochen', 'food', 'blogging'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc06', 'Lena Meyer', 24, 'female', 'Tänzerin 💃 Salsa ist mein Leben!', 'de', 'DE', 'Stuttgart', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['tanzen', 'salsa', 'musik'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc07', 'Lea Wagner', 26, 'female', 'Grafikdesignerin 🎨 Kreativität ohne Grenzen!', 'de', 'DE', 'Düsseldorf', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'kunst', 'digital'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc08', 'Laura Becker', 28, 'female', 'Ärztin 👩‍⚕️ Menschen helfen!', 'de', 'DE', 'Leipzig', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medizin', 'gesundheit', 'helfen'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc09', 'Marie Hoffmann', 27, 'female', 'Lehrerin 📚 Bildung ist wichtig!', 'de', 'DE', 'Dresden', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['bildung', 'lehren', 'kinder'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc10', 'Sarah Schulz', 25, 'female', 'Personal Trainerin 💪 Fitness ist Leben!', 'de', 'DE', 'Nürnberg', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'training'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc11', 'Lisa Hofmann', 29, 'female', 'Anwältin ⚖️ Gerechtigkeit!', 'de', 'DE', 'Hannover', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['recht', 'justiz', 'politik'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc12', 'Julia Klein', 26, 'female', 'Barista ☕ Perfekter Kaffee!', 'de', 'DE', 'Bremen', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['kaffee', 'barista', 'cafés'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc13', 'Amelie Wolf', 28, 'female', 'Event-Managerin 🎉 Beste Partys!', 'de', 'DE', 'Dortmund', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['events', 'partys', 'organisation'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc14', 'Charlotte Richter', 27, 'female', 'Psychologin 🧠 Zuhören und verstehen!', 'de', 'DE', 'Essen', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychologie', 'therapie', 'empathie'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc15', 'Emilia Zimmermann', 25, 'female', 'Sommelière 🍷 Wein-Expertin!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['wein', 'gastronomie', 'genuss'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc16', 'Johanna Braun', 26, 'female', 'Tierärztin 🐕 Tierliebe!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['tiere', 'veterinär', 'natur'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc17', 'Luisa Krüger', 29, 'female', 'Software-Entwicklerin 💻 Code & Kaffee!', 'de', 'DE', 'Hamburg', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programmieren', 'tech', 'code'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc18', 'Paula Lange', 24, 'female', 'Influencerin 📱 Mode & Lifestyle!', 'de', 'DE', 'Köln', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['mode', 'beauty', 'lifestyle'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc19', 'Frieda Schmitt', 27, 'female', 'Konditorin 🧁 Süße Träume!', 'de', 'DE', 'Frankfurt', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['backen', 'konditorei', 'desserts'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc20', 'Greta Neumann', 28, 'female', 'Journalistin 📰 Geschichten erzählen!', 'de', 'DE', 'Stuttgart', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalismus', 'schreiben', 'news'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc21', 'Ida Vogt', 26, 'female', 'Meeresbiologin 🐠 Ozean-Liebe!', 'de', 'DE', 'Kiel', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['biologie', 'ozean', 'umwelt'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc22', 'Klara Herrmann', 25, 'female', 'Model & Schauspielerin 🎭 Kreativ!', 'de', 'DE', 'Berlin', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['schauspiel', 'modeling', 'kunst'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc23', 'Lotte König', 27, 'female', 'Musikerin 🎸 Rock ist Leben!', 'de', 'DE', 'Leipzig', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['musik', 'rock', 'gitarre'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc24', 'Martha Kaiser', 29, 'female', 'Immobilienmaklerin 🏡 Traumhäuser!', 'de', 'DE', 'Düsseldorf', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['immobilien', 'business', 'architektur'], true, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc25', 'Nora Sommer', 26, 'female', 'Krankenschwester ❤️ Pflege!', 'de', 'DE', 'München', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['pflege', 'gesundheit', 'hilfe'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 🇫🇷 FRANCIE - Françaises (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'Amélie Dubois', 25, 'female', 'Photographe à Paris 📸 Art et beauté!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['photographie', 'art', 'voyage'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd02', 'Chloé Martin', 27, 'female', 'Chef pâtissière 🥐 Les meilleurs croissants!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop', ARRAY['pâtisserie', 'cuisine', 'gastronomie'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd03', 'Emma Bernard', 26, 'female', 'Professeur de yoga 🧘‍♀️ Paix intérieure!', 'fr', 'FR', 'Marseille', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'méditation', 'bien-être'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd04', 'Inès Petit', 28, 'female', 'Architecte 🏛️ Créer la beauté!', 'fr', 'FR', 'Nice', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architecture', 'design', 'art'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd05', 'Léa Robert', 29, 'female', 'Sommelière 🍷 Passion du vin!', 'fr', 'FR', 'Bordeaux', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['vin', 'gastronomie', 'dégustation'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd06', 'Manon Richard', 24, 'female', 'Danseuse de ballet 🩰 Grâce!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['danse', 'ballet', 'musique'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd07', 'Zoé Simon', 26, 'female', 'Designer de mode 👗 Créatrice!', 'fr', 'FR', 'Cannes', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['mode', 'design', 'couture'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd08', 'Camille Laurent', 27, 'female', 'Médecin 👩‍⚕️ Aider les gens!', 'fr', 'FR', 'Toulouse', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['médecine', 'santé', 'aide'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd09', 'Juliette Moreau', 25, 'female', 'Barista ☕ Café parfait!', 'fr', 'FR', 'Lille', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['café', 'barista', 'cafés'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd10', 'Lou Fournier', 28, 'female', 'Psychologue 🧠 Écoute active!', 'fr', 'FR', 'Nantes', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychologie', 'thérapie', 'écoute'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd11', 'Alice Girard', 26, 'female', 'Coach sportive 💪 Santé!', 'fr', 'FR', 'Strasbourg', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'coaching'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd12', 'Rose Bonnet', 27, 'female', 'Avocate ⚖️ Justice!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['droit', 'justice', 'défense'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd13', 'Sarah Blanc', 25, 'female', 'Vétérinaire 🐕 Amour des animaux!', 'fr', 'FR', 'Rennes', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animaux', 'vétérinaire', 'nature'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd14', 'Jade Faure', 29, 'female', 'Journaliste 📰 Vérité!', 'fr', 'FR', 'Montpellier', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['journalisme', 'actualité', 'écriture'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd15', 'Lola Roux', 24, 'female', 'Développeuse web 💻 Code!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['code', 'tech', 'web'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd16', 'Nina Garnier', 26, 'female', 'Event planner 🎉 Fêtes!', 'fr', 'FR', 'Aix-en-Provence', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['événements', 'fêtes', 'organisation'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd17', 'Clara Chevalier', 27, 'female', 'Professeure 📚 Éducation!', 'fr', 'FR', 'Tours', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['éducation', 'enseignement', 'enfants'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd18', 'Lucie Dupont', 28, 'female', 'Graphiste 🎨 Créativité!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'graphisme', 'art'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd19', 'Margot Leroy', 25, 'female', 'Infirmière ❤️ Soins!', 'fr', 'FR', 'Dijon', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['santé', 'soins', 'compassion'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd20', 'Océane André', 26, 'female', 'Musicienne 🎸 Rock!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['musique', 'rock', 'guitare'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd21', 'Pauline Thomas', 27, 'female', 'Biologiste marine 🐠 Océan!', 'fr', 'FR', 'Brest', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['océan', 'biologie', 'nature'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd22', 'Victoria Bertrand', 28, 'female', 'Agent immobilier 🏡 Maisons de rêve!', 'fr', 'FR', 'Nice', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['immobilier', 'vente', 'business'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd23', 'Agathe Rousseau', 26, 'female', 'Influenceuse 📱 Mode!', 'fr', 'FR', 'Paris', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['mode', 'beauté', 'social media'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd24', 'Anaïs Vincent', 25, 'female', 'Coach sportive 🏋️‍♀️ Fitness!', 'fr', 'FR', 'Marseille', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'coaching'], true, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd25', 'Capucine Dumas', 27, 'female', 'Travel blogger ✈️ Aventures!', 'fr', 'FR', 'Lyon', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['voyage', 'blog', 'aventure'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Aktualizovaný výsledek
SELECT 
    country,
    language,
    COUNT(*) as count
FROM public.discovery_profiles
WHERE is_ai_profile = true
AND (id LIKE 'aaaaaaaa-%' OR id LIKE 'bbbbbbbb-%' OR id LIKE 'cccccccc-%' OR id LIKE 'dddddddd-%')
GROUP BY country, language
ORDER BY country, language;

SELECT COUNT(*) as total_new_profiles 
FROM public.discovery_profiles 
WHERE id LIKE 'aaaaaaaa-%' OR id LIKE 'bbbbbbbb-%' OR id LIKE 'cccccccc-%' OR id LIKE 'dddddddd-%';

COMMIT;

-- ========================================
-- 🌍 100 DALŠÍCH MEZINÁRODNÍCH PROFILŮ
-- Španělsko, Itálie, Polsko, Portugalsko
-- ========================================

-- 🇪🇸 ŠPANĚLSKO - Españolas (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'María García', 25, 'female', 'Bailarina de flamenco 💃 ¡El baile es mi vida!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['baile', 'flamenco', 'música'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'Carmen Rodríguez', 28, 'female', 'Chef profesional 👩‍🍳 ¡Experta en paella!', 'es', 'ES', 'Valencia', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['cocina', 'gastronomía', 'paella'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'Lucía Martínez', 26, 'female', 'Profesora de yoga 🧘‍♀️ Paz y armonía!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'meditación', 'bienestar'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'Ana López', 27, 'female', 'Arquitecta 🏛️ Diseñando el futuro!', 'es', 'ES', 'Sevilla', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['arquitectura', 'diseño', 'arte'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'Isabel Fernández', 29, 'female', 'Sumiller profesional 🍷 Amante del vino!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['vino', 'gastronomía', 'cata'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee06', 'Laura Sánchez', 24, 'female', 'Fotógrafa 📸 Capturando momentos!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografía', 'arte', 'viajes'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee07', 'Paula Gómez', 26, 'female', 'Diseñadora de moda 👗 Estilo único!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['moda', 'diseño', 'estilo'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee08', 'Sara Ruiz', 28, 'female', 'Médica 👩‍⚕️ Ayudando a la gente!', 'es', 'ES', 'Valencia', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medicina', 'salud', 'ayuda'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee09', 'Elena Díaz', 25, 'female', 'Barista ☕ ¡Café perfecto!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['café', 'barista', 'arte'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee10', 'Marta Moreno', 27, 'female', 'Psicóloga 🧠 Escucho!', 'es', 'ES', 'Málaga', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psicología', 'terapia', 'ayuda'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee11', 'Cristina Jiménez', 26, 'female', 'Entrenadora personal 💪 ¡Fitness!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'deporte', 'salud'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee12', 'Raquel Álvarez', 29, 'female', 'Abogada ⚖️ Justicia!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['derecho', 'justicia', 'leyes'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee13', 'Beatriz Torres', 24, 'female', 'Veterinaria 🐕 ¡Amo los animales!', 'es', 'ES', 'Sevilla', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animales', 'veterinaria', 'naturaleza'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee14', 'Sofía Romero', 28, 'female', 'Periodista 📰 Buscando la verdad!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['periodismo', 'noticias', 'escritura'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee15', 'Andrea Navarro', 27, 'female', 'Desarrolladora web 💻 ¡Código!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programación', 'tech', 'web'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee16', 'Natalia Gil', 25, 'female', 'Event planner 🎉 ¡Fiestas!', 'es', 'ES', 'Valencia', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['eventos', 'fiestas', 'organización'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee17', 'Patricia Castro', 26, 'female', 'Profesora 📚 Educación!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['educación', 'enseñanza', 'niños'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee18', 'Carolina Ramos', 29, 'female', 'Diseñadora gráfica 🎨 Creatividad!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['diseño', 'arte', 'creatividad'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee19', 'Verónica Herrera', 24, 'female', 'Enfermera ❤️ Cuidados!', 'es', 'ES', 'Sevilla', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['salud', 'cuidados', 'medicina'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee20', 'Silvia Molina', 27, 'female', 'Música 🎸 ¡Rock!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['música', 'rock', 'guitarra'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee21', 'Alicia Ortiz', 28, 'female', 'Bióloga marina 🐠 ¡Océano!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['océano', 'biología', 'naturaleza'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee22', 'Rocío Delgado', 26, 'female', 'Agente inmobiliaria 🏡 ¡Casas!', 'es', 'ES', 'Valencia', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['inmobiliaria', 'ventas', 'casas'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee23', 'Pilar Vega', 25, 'female', 'Influencer 📱 ¡Moda!', 'es', 'ES', 'Madrid', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['moda', 'belleza', 'instagram'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee24', 'Mónica Serrano', 29, 'female', 'Coach deportiva 🏋️‍♀️ ¡Motivación!', 'es', 'ES', 'Barcelona', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'coaching', 'deporte'], true, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee25', 'Nuria Blanco', 27, 'female', 'Travel blogger ✈️ ¡Aventuras!', 'es', 'ES', 'Sevilla', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['viajes', 'blog', 'aventura'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 🇮🇹 ITÁLIE - Italiane (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Giulia Rossi', 25, 'female', 'Chef italiana 👩‍🍳 La pasta è la mia passione!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['cucina', 'pasta', 'gastronomia'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff02', 'Sofia Russo', 27, 'female', 'Designer di moda 👗 Stile italiano!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['moda', 'design', 'stile'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff03', 'Martina Ferrari', 26, 'female', 'Insegnante di yoga 🧘‍♀️ Pace interiore!', 'it', 'IT', 'Firenze', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'meditazione', 'benessere'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff04', 'Chiara Bianchi', 28, 'female', 'Architetta 🏛️ Creo bellezza!', 'it', 'IT', 'Venezia', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architettura', 'design', 'arte'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff05', 'Francesca Romano', 29, 'female', 'Sommelier 🍷 Esperta di vino!', 'it', 'IT', 'Toscana', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['vino', 'gastronomia', 'degustazione'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff06', 'Valentina Colombo', 24, 'female', 'Ballerina 💃 Danza classica!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['danza', 'balletto', 'musica'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff07', 'Alessia Ricci', 26, 'female', 'Fotografa 📸 Arte visiva!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografia', 'arte', 'viaggi'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff08', 'Elena Marino', 27, 'female', 'Medico 👩‍⚕️ Aiuto le persone!', 'it', 'IT', 'Napoli', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medicina', 'salute', 'aiuto'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff09', 'Sara Greco', 25, 'female', 'Barista ☕ Caffè perfetto!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['caffè', 'barista', 'arte'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff10', 'Giorgia Bruno', 28, 'female', 'Psicologa 🧠 Ascolto attivo!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psicologia', 'terapia', 'ascolto'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff11', 'Anna Gallo', 26, 'female', 'Personal trainer 💪 Fitness!', 'it', 'IT', 'Torino', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'salute'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff12', 'Laura Conti', 27, 'female', 'Avvocato ⚖️ Giustizia!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['legge', 'giustizia', 'diritto'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff13', 'Beatrice De Luca', 24, 'female', 'Veterinaria 🐕 Amo gli animali!', 'it', 'IT', 'Firenze', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animali', 'veterinaria', 'natura'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff14', 'Camilla Mancini', 29, 'female', 'Giornalista 📰 Verità!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['giornalismo', 'notizie', 'scrittura'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff15', 'Emma Costa', 25, 'female', 'Sviluppatrice web 💻 Codice!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programmazione', 'tech', 'web'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff16', 'Alice Fontana', 26, 'female', 'Event planner 🎉 Feste!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['eventi', 'feste', 'organizzazione'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff17', 'Matilde Barbieri', 27, 'female', 'Insegnante 📚 Educazione!', 'it', 'IT', 'Firenze', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['educazione', 'insegnamento', 'bambini'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff18', 'Greta Lombardi', 28, 'female', 'Grafica 🎨 Creatività!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'arte', 'grafica'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff19', 'Rebecca Moretti', 24, 'female', 'Infermiera ❤️ Cura!', 'it', 'IT', 'Napoli', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['salute', 'cura', 'medicina'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff20', 'Aurora Ferrara', 26, 'female', 'Musicista 🎸 Rock italiano!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['musica', 'rock', 'chitarra'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff21', 'Viola Santoro', 27, 'female', 'Biologa marina 🐠 Oceano!', 'it', 'IT', 'Venezia', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['oceano', 'biologia', 'natura'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff22', 'Nicole Marini', 28, 'female', 'Agente immobiliare 🏡 Case!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['immobiliare', 'vendite', 'case'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff23', 'Luna Rinaldi', 25, 'female', 'Influencer 📱 Moda!', 'it', 'IT', 'Milano', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['moda', 'bellezza', 'instagram'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff24', 'Bianca Caruso', 29, 'female', 'Coach sportiva 🏋️‍♀️ Motivazione!', 'it', 'IT', 'Firenze', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'coaching', 'sport'], true, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff25', 'Serena Rossetti', 26, 'female', 'Travel blogger ✈️ Avventure!', 'it', 'IT', 'Roma', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['viaggi', 'blog', 'avventura'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 🇵🇱 POLSKO - Polki (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city,
    photo_url, interests, is_ai_profile, created_at
) VALUES
('11111111-1111-1111-1111-111111111101', 'Anna Kowalska', 25, 'female', 'Architektka 🏛️ Projektuję przyszłość!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['architektura', 'design', 'sztuka'], true, NOW()),
('11111111-1111-1111-1111-111111111102', 'Maria Nowak', 27, 'female', 'Szefowa kuchni 👩‍🍳 Gotowanie to moja pasja!', 'pl', 'PL', 'Kraków', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['gotowanie', 'kulinaria', 'jedzenie'], true, NOW()),
('11111111-1111-1111-1111-111111111103', 'Zofia Wiśniewska', 26, 'female', 'Instruktorka jogi 🧘‍♀️ Spokój!', 'pl', 'PL', 'Wrocław', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['joga', 'medytacja', 'wellness'], true, NOW()),
('11111111-1111-1111-1111-111111111104', 'Julia Dąbrowska', 28, 'female', 'Fotografka 📸 Piękno wszędzie!', 'pl', 'PL', 'Gdańsk', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografia', 'sztuka', 'podróże'], true, NOW()),
('11111111-1111-1111-1111-111111111105', 'Maja Lewandowska', 29, 'female', 'Sommelierka 🍷 Znawczyni win!', 'pl', 'PL', 'Poznań', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['wino', 'gastronomia', 'degustacja'], true, NOW()),
('11111111-1111-1111-1111-111111111106', 'Oliwia Kamińska', 24, 'female', 'Tancerka 💃 Taniec to życie!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['taniec', 'balet', 'muzyka'], true, NOW()),
('11111111-1111-1111-1111-111111111107', 'Lena Zielińska', 26, 'female', 'Projektantka mody 👗 Styl!', 'pl', 'PL', 'Łódź', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['moda', 'design', 'styl'], true, NOW()),
('11111111-1111-1111-1111-111111111108', 'Natalia Szymańska', 27, 'female', 'Lekarka 👩‍⚕️ Pomagam ludziom!', 'pl', 'PL', 'Kraków', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medycyna', 'zdrowie', 'pomoc'], true, NOW()),
('11111111-1111-1111-1111-111111111109', 'Weronika Woźniak', 25, 'female', 'Barista ☕ Idealna kawa!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['kawa', 'barista', 'sztuka'], true, NOW()),
('11111111-1111-1111-1111-111111111110', 'Alicja Kozłowska', 28, 'female', 'Psycholog 🧠 Słucham!', 'pl', 'PL', 'Wrocław', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psychologia', 'terapia', 'empatia'], true, NOW()),
('11111111-1111-1111-1111-111111111111', 'Emilia Jankowska', 26, 'female', 'Trenerka personalna 💪 Fitness!', 'pl', 'PL', 'Gdańsk', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'sport', 'zdrowie'], true, NOW()),
('11111111-1111-1111-1111-111111111112', 'Amelia Krawczyk', 27, 'female', 'Prawniczka ⚖️ Sprawiedliwość!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['prawo', 'sprawiedliwość', 'polityka'], true, NOW()),
('11111111-1111-1111-1111-111111111113', 'Pola Piotrowska', 24, 'female', 'Weterynarz 🐕 Kocham zwierzęta!', 'pl', 'PL', 'Poznań', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['zwierzęta', 'weterynaria', 'natura'], true, NOW()),
('11111111-1111-1111-1111-111111111114', 'Hanna Grabowska', 29, 'female', 'Dziennikarka 📰 Prawda!', 'pl', 'PL', 'Kraków', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['dziennikarstwo', 'pisanie', 'media'], true, NOW()),
('11111111-1111-1111-1111-111111111115', 'Laura Pawlak', 25, 'female', 'Programistka 💻 Kod!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programowanie', 'tech', 'IT'], true, NOW()),
('11111111-1111-1111-1111-111111111116', 'Gabriela Michalska', 26, 'female', 'Event manager 🎉 Imprezy!', 'pl', 'PL', 'Wrocław', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['wydarzenia', 'imprezy', 'organizacja'], true, NOW()),
('11111111-1111-1111-1111-111111111117', 'Klara Król', 27, 'female', 'Nauczycielka 📚 Edukacja!', 'pl', 'PL', 'Gdańsk', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['edukacja', 'nauczanie', 'dzieci'], true, NOW()),
('11111111-1111-1111-1111-111111111118', 'Nela Wróbel', 28, 'female', 'Grafik 🎨 Kreatywność!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'sztuka', 'grafika'], true, NOW()),
('11111111-1111-1111-1111-111111111119', 'Antonina Adamczyk', 24, 'female', 'Pielęgniarka ❤️ Opieka!', 'pl', 'PL', 'Kraków', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['zdrowie', 'opieka', 'medycyna'], true, NOW()),
('11111111-1111-1111-1111-111111111120', 'Iga Dudek', 26, 'female', 'Muzyk 🎸 Rock!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['muzyka', 'rock', 'gitara'], true, NOW()),
('11111111-1111-1111-1111-111111111121', 'Helena Nowakowska', 27, 'female', 'Biolog morski 🐠 Ocean!', 'pl', 'PL', 'Gdynia', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['ocean', 'biologia', 'natura'], true, NOW()),
('11111111-1111-1111-1111-111111111122', 'Lilianna Mazur', 28, 'female', 'Agent nieruchomości 🏡 Domy!', 'pl', 'PL', 'Warszawa', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['nieruchomości', 'sprzedaż', 'domy'], true, NOW()),
('11111111-1111-1111-1111-111111111123', 'Nikola Kaczmarek', 25, 'female', 'Influencerka 📱 Moda!', 'pl', 'PL', 'Kraków', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['moda', 'beauty', 'instagram'], true, NOW()),
('11111111-1111-1111-1111-111111111124', 'Kaja Sikora', 29, 'female', 'Trenerka sportowa 🏋️‍♀️ Motywacja!', 'pl', 'PL', 'Wrocław', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'coaching', 'sport'], true, NOW()),
('11111111-1111-1111-1111-111111111125', 'Zuzanna Kubiak', 26, 'female', 'Travel blogger ✈️ Przygody!', 'pl', 'PL', 'Gdańsk', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['podróże', 'blog', 'przygoda'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 🇵🇹 PORTUGALSKO - Portuguesas (25 profilů)
INSERT INTO public.discovery_profiles (
    id, name, age, gender, bio, language, country, city, 
    photo_url, interests, is_ai_profile, created_at
) VALUES
('22222222-2222-2222-2222-222222222201', 'Maria Silva', 25, 'female', 'Chef portuguesa 👩‍🍳 Bacalhau é a minha especialidade!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['cozinha', 'gastronomia', 'bacalhau'], true, NOW()),
('22222222-2222-2222-2222-222222222202', 'Ana Santos', 27, 'female', 'Designer de moda 👗 Estilo português!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop', ARRAY['moda', 'design', 'estilo'], true, NOW()),
('22222222-2222-2222-2222-222222222203', 'Beatriz Ferreira', 26, 'female', 'Professora de yoga 🧘‍♀️ Paz interior!', 'pt', 'PT', 'Coimbra', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['yoga', 'meditação', 'bem-estar'], true, NOW()),
('22222222-2222-2222-2222-222222222204', 'Carolina Rodrigues', 28, 'female', 'Arquiteta 🏛️ Criando beleza!', 'pt', 'PT', 'Braga', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['arquitetura', 'design', 'arte'], true, NOW()),
('22222222-2222-2222-2222-222222222205', 'Diana Pereira', 29, 'female', 'Sommelier 🍷 Especialista em vinhos!', 'pt', 'PT', 'Douro', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&h=1000&fit=crop', ARRAY['vinho', 'gastronomia', 'degustação'], true, NOW()),
('22222222-2222-2222-2222-222222222206', 'Eva Costa', 24, 'female', 'Bailarina 💃 Dança tradicional!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['dança', 'folclore', 'música'], true, NOW()),
('22222222-2222-2222-2222-222222222207', 'Francisca Oliveira', 26, 'female', 'Fotógrafa 📸 Arte visual!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['fotografia', 'arte', 'viagens'], true, NOW()),
('22222222-2222-2222-2222-222222222208', 'Gabriela Martins', 27, 'female', 'Médica 👩‍⚕️ Ajudar pessoas!', 'pt', 'PT', 'Faro', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['medicina', 'saúde', 'ajuda'], true, NOW()),
('22222222-2222-2222-2222-222222222209', 'Helena Alves', 25, 'female', 'Barista ☕ Café perfeito!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=800&h=1000&fit=crop', ARRAY['café', 'barista', 'arte'], true, NOW()),
('22222222-2222-2222-2222-222222222210', 'Inês Lopes', 28, 'female', 'Psicóloga 🧠 Escuta ativa!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop', ARRAY['psicologia', 'terapia', 'escuta'], true, NOW()),
('22222222-2222-2222-2222-222222222211', 'Joana Sousa', 26, 'female', 'Personal trainer 💪 Fitness!', 'pt', 'PT', 'Cascais', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'desporto', 'saúde'], true, NOW()),
('22222222-2222-2222-2222-222222222212', 'Laura Gonçalves', 27, 'female', 'Advogada ⚖️ Justiça!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop', ARRAY['direito', 'justiça', 'lei'], true, NOW()),
('22222222-2222-2222-2222-222222222213', 'Leonor Ribeiro', 24, 'female', 'Veterinária 🐕 Amo animais!', 'pt', 'PT', 'Coimbra', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&h=1000&fit=crop', ARRAY['animais', 'veterinária', 'natureza'], true, NOW()),
('22222222-2222-2222-2222-222222222214', 'Madalena Carvalho', 29, 'female', 'Jornalista 📰 Verdade!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&h=1000&fit=crop', ARRAY['jornalismo', 'notícias', 'escrita'], true, NOW()),
('22222222-2222-2222-2222-222222222215', 'Mariana Pinto', 25, 'female', 'Programadora 💻 Código!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop', ARRAY['programação', 'tech', 'web'], true, NOW()),
('22222222-2222-2222-2222-222222222216', 'Matilde Teixeira', 26, 'female', 'Event planner 🎉 Festas!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop', ARRAY['eventos', 'festas', 'organização'], true, NOW()),
('22222222-2222-2222-2222-222222222217', 'Rita Nunes', 27, 'female', 'Professora 📚 Educação!', 'pt', 'PT', 'Braga', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['educação', 'ensino', 'crianças'], true, NOW()),
('22222222-2222-2222-2222-222222222218', 'Sara Correia', 28, 'female', 'Designer gráfica 🎨 Criatividade!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop', ARRAY['design', 'arte', 'gráfica'], true, NOW()),
('22222222-2222-2222-2222-222222222219', 'Sofia Mendes', 24, 'female', 'Enfermeira ❤️ Cuidar!', 'pt', 'PT', 'Faro', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop', ARRAY['saúde', 'cuidados', 'medicina'], true, NOW()),
('22222222-2222-2222-2222-222222222220', 'Teresa Fernandes', 26, 'female', 'Música 🎸 Fado e rock!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1531746020798-e44692c8addb?w=800&h=1000&fit=crop', ARRAY['música', 'fado', 'rock'], true, NOW()),
('22222222-2222-2222-2222-222222222221', 'Vera Marques', 27, 'female', 'Bióloga marinha 🐠 Oceano!', 'pt', 'PT', 'Cascais', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop', ARRAY['oceano', 'biologia', 'natureza'], true, NOW()),
('22222222-2222-2222-2222-222222222222', 'Vitória Moreira', 28, 'female', 'Agente imobiliária 🏡 Casas!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', ARRAY['imobiliário', 'vendas', 'casas'], true, NOW()),
('22222222-2222-2222-2222-222222222223', 'Alice Reis', 25, 'female', 'Influencer 📱 Moda!', 'pt', 'PT', 'Lisboa', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop', ARRAY['moda', 'beleza', 'instagram'], true, NOW()),
('22222222-2222-2222-2222-222222222224', 'Bárbara Ramos', 29, 'female', 'Coach desportiva 🏋️‍♀️ Motivação!', 'pt', 'PT', 'Coimbra', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&h=1000&fit=crop', ARRAY['fitness', 'coaching', 'desporto'], true, NOW()),
('22222222-2222-2222-2222-222222222225', 'Constança Dias', 26, 'female', 'Travel blogger ✈️ Aventuras!', 'pt', 'PT', 'Porto', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop', ARRAY['viagens', 'blog', 'aventura'], true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Výsledek
SELECT
    country,
    language,
    COUNT(*) as count
FROM public.discovery_profiles
WHERE is_ai_profile = true
AND (id::text LIKE 'eeeeeeee-%' OR id::text LIKE 'ffffffff-%' OR id::text LIKE '11111111-%' OR id::text LIKE '22222222-%')
GROUP BY country, language
ORDER BY country, language;

SELECT COUNT(*) as total_new_profiles
FROM public.discovery_profiles
WHERE (id::text LIKE 'eeeeeeee-%' OR id::text LIKE 'ffffffff-%' OR id::text LIKE '11111111-%' OR id::text LIKE '22222222-%');

COMMIT;

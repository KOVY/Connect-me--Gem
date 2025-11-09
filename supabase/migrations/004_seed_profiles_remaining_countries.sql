-- ========================================
-- 🌍 REMAINING COUNTRIES PROFILES - 600 profiles
-- DE (100), FR (100), ES (100), IT (100), PL (100), PT (100)
-- ========================================

-- Helper arrays for generating profiles
DO $$
DECLARE
    -- Germany
    german_female_names TEXT[] := ARRAY['Anna', 'Maria', 'Emma', 'Sophie', 'Laura', 'Lisa', 'Julia', 'Sarah', 'Lena', 'Hannah', 'Lea', 'Nina', 'Mia', 'Elena', 'Jana', 'Sophia', 'Katharina', 'Johanna', 'Marie', 'Luisa', 'Charlotte', 'Emilia', 'Amelie', 'Clara', 'Isabella', 'Annika', 'Paula', 'Nele', 'Fiona', 'Victoria', 'Alina', 'Jasmin', 'Michelle', 'Vanessa', 'Rebecca', 'Sabrina', 'Nicole', 'Stefanie', 'Christina', 'Andrea', 'Melanie', 'Sandra', 'Daniela', 'Julia', 'Simone', 'Claudia', 'Petra', 'Birgit', 'Monika', 'Susanne'];
    german_male_names TEXT[] := ARRAY['Lukas', 'Leon', 'Tim', 'Paul', 'Jonas', 'Felix', 'Noah', 'Elias', 'Ben', 'Finn', 'Max', 'Moritz', 'David', 'Jan', 'Alexander', 'Philipp', 'Simon', 'Tobias', 'Julian', 'Sebastian', 'Christian', 'Daniel', 'Michael', 'Thomas', 'Andreas', 'Stefan', 'Matthias', 'Martin', 'Patrick', 'Marcel', 'Kevin', 'Dennis', 'Dominik', 'Fabian', 'Florian', 'Lars', 'Marvin', 'Robin', 'Nico', 'Oliver', 'Peter', 'Klaus', 'Wolfgang', 'Jürgen', 'Hans', 'Uwe', 'Ralf', 'Markus', 'Jörg', 'Dirk'];
    german_cities TEXT[] := ARRAY['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'];

    -- France
    french_female_names TEXT[] := ARRAY['Marie', 'Camille', 'Julie', 'Emma', 'Léa', 'Chloé', 'Sarah', 'Laura', 'Manon', 'Clara', 'Lucie', 'Océane', 'Mathilde', 'Lisa', 'Charlotte', 'Inès', 'Pauline', 'Louise', 'Alice', 'Jade', 'Zoé', 'Lola', 'Juliette', 'Anaïs', 'Nina', 'Elise', 'Eva', 'Margot', 'Emilie', 'Céline', 'Sophie', 'Nathalie', 'Isabelle', 'Sylvie', 'Valérie', 'Catherine', 'Martine', 'Christine', 'Monique', 'Françoise', 'Sandrine', 'Stéphanie', 'Audrey', 'Virginie', 'Laure', 'Marion', 'Hélène', 'Amélie', 'Caroline', 'Delphine'];
    french_male_names TEXT[] := ARRAY['Alexandre', 'Lucas', 'Theo', 'Hugo', 'Louis', 'Jules', 'Gabriel', 'Arthur', 'Maxime', 'Thomas', 'Nicolas', 'Antoine', 'Pierre', 'Paul', 'Julien', 'Adrien', 'Clément', 'Romain', 'Kevin', 'Florian', 'Mathieu', 'Benjamin', 'Quentin', 'David', 'Marc', 'Laurent', 'Vincent', 'Olivier', 'Stéphane', 'Christophe', 'François', 'Philippe', 'Eric', 'Jean', 'Michel', 'Patrick', 'Bernard', 'Alain', 'Daniel', 'Christian', 'Sébastien', 'Fabien', 'Guillaume', 'Jérôme', 'Raphaël', 'Arnaud', 'Cédric', 'Damien', 'Frédéric', 'Sylvain'];
    french_cities TEXT[] := ARRAY['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Nantes', 'Strasbourg', 'Lille', 'Rennes'];

    -- Spain
    spanish_female_names TEXT[] := ARRAY['María', 'Carmen', 'Ana', 'Isabel', 'Laura', 'Cristina', 'Marta', 'Paula', 'Sara', 'Lucía', 'Elena', 'Raquel', 'Natalia', 'Patricia', 'Andrea', 'Alba', 'Julia', 'Claudia', 'Irene', 'Sofía', 'Beatriz', 'Rosa', 'Pilar', 'Teresa', 'Mercedes', 'Dolores', 'Rocío', 'Inmaculada', 'Silvia', 'Nuria', 'Alicia', 'Amparo', 'Montserrat', 'Yolanda', 'Eva', 'Victoria', 'Ángela', 'Carolina', 'Mónica', 'Esther', 'Susana', 'Blanca', 'Verónica', 'Lidia', 'Marina', 'Noelia', 'Gemma', 'Miriam', 'Sandra', 'Vanesa'];
    spanish_male_names TEXT[] := ARRAY['Antonio', 'José', 'Manuel', 'Francisco', 'David', 'Juan', 'Javier', 'Daniel', 'Carlos', 'Miguel', 'Alejandro', 'Pablo', 'Pedro', 'Sergio', 'Luis', 'Jorge', 'Alberto', 'Fernando', 'Diego', 'Ángel', 'Raúl', 'Rafael', 'Iván', 'Adrián', 'Rubén', 'Óscar', 'Enrique', 'Víctor', 'Andrés', 'Jesús', 'Ignacio', 'Álvaro', 'Roberto', 'Marcos', 'Julio', 'Eduardo', 'Gonzalo', 'César', 'Guillermo', 'Ricardo', 'Martín', 'Hugo', 'Marc', 'Jordi', 'Cristian', 'Samuel', 'Emilio', 'Jaime', 'Santiago', 'Joaquín'];
    spanish_cities TEXT[] := ARRAY['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Bilbao', 'Alicante', 'Granada', 'Murcia'];

    -- Italy
    italian_female_names TEXT[] := ARRAY['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia', 'Greta', 'Beatrice', 'Anna', 'Chiara', 'Sara', 'Martina', 'Francesca', 'Alessia', 'Elena', 'Ilaria', 'Valentina', 'Federica', 'Silvia', 'Laura', 'Elisa', 'Monica', 'Paola', 'Cristina', 'Maria', 'Stefania', 'Claudia', 'Roberta', 'Daniela', 'Simona', 'Barbara', 'Sabrina', 'Angela', 'Patrizia', 'Antonella', 'Rosa', 'Lucia', 'Emanuela', 'Alessandra', 'Veronica', 'Manuela', 'Cinzia', 'Giovanna', 'Rita', 'Serena', 'Nicoletta', 'Michela', 'Raffaella', 'Donatella'];
    italian_male_names TEXT[] := ARRAY['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Tommaso', 'Riccardo', 'Davide', 'Giuseppe', 'Antonio', 'Marco', 'Giovanni', 'Luca', 'Paolo', 'Carlo', 'Stefano', 'Pietro', 'Roberto', 'Matteo', 'Simone', 'Federico', 'Filippo', 'Nicola', 'Michele', 'Daniele', 'Emanuele', 'Vincenzo', 'Diego', 'Alessio', 'Fabio', 'Enrico', 'Salvatore', 'Massimo', 'Giorgio', 'Alberto', 'Bruno', 'Sergio', 'Mario', 'Luigi', 'Franco', 'Claudio', 'Gianni', 'Mauro', 'Marcello', 'Cesare', 'Angelo', 'Renato', 'Umberto'];
    italian_cities TEXT[] := ARRAY['Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze', 'Venezia', 'Verona'];

    -- Poland
    polish_female_names TEXT[] := ARRAY['Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Krystyna', 'Barbara', 'Ewa', 'Elżbieta', 'Zofia', 'Janina', 'Teresa', 'Jadwiga', 'Danuta', 'Irena', 'Halina', 'Helena', 'Beata', 'Aleksandra', 'Magdalena', 'Monika', 'Joanna', 'Dorota', 'Iwona', 'Jolanta', 'Renata', 'Grażyna', 'Bożena', 'Stanisława', 'Wanda', 'Natalia', 'Karolina', 'Julia', 'Zuzanna', 'Martyna', 'Wiktoria', 'Oliwia', 'Maja', 'Lena', 'Amelia', 'Hanna', 'Alicja', 'Nikola', 'Paulina', 'Patrycja', 'Sylwia', 'Aneta', 'Izabela', 'Agata', 'Marta'];
    polish_male_names TEXT[] := ARRAY['Jan', 'Andrzej', 'Piotr', 'Krzysztof', 'Stanisław', 'Tomasz', 'Paweł', 'Józef', 'Marcin', 'Marek', 'Michał', 'Grzegorz', 'Jerzy', 'Tadeusz', 'Adam', 'Łukasz', 'Zbigniew', 'Ryszard', 'Kazimierz', 'Mateusz', 'Dariusz', 'Henryk', 'Mariusz', 'Jakub', 'Wojciech', 'Robert', 'Rafał', 'Jacek', 'Janusz', 'Mirosław', 'Maciej', 'Sławomir', 'Jarosław', 'Kamil', 'Wiesław', 'Roman', 'Władysław', 'Zdzisław', 'Aleksander', 'Radosław', 'Eugeniusz', 'Witold', 'Konrad', 'Filip', 'Sebastian', 'Damian', 'Dawid', 'Bartosz', 'Hubert', 'Kacper'];
    polish_cities TEXT[] := ARRAY['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'];

    -- Portugal
    portuguese_female_names TEXT[] := ARRAY['Maria', 'Ana', 'Joana', 'Beatriz', 'Inês', 'Sara', 'Mariana', 'Carolina', 'Catarina', 'Rita', 'Sofia', 'Marta', 'Patrícia', 'Diana', 'Cláudia', 'Sandra', 'Filipa', 'Cristina', 'Andreia', 'Raquel', 'Helena', 'Mónica', 'Isabel', 'Teresa', 'Carla', 'Paula', 'Sílvia', 'Susana', 'Vera', 'Daniela', 'Vanessa', 'Liliana', 'Anabela', 'Fátima', 'Manuela', 'Graça', 'Conceição', 'Rosa', 'Lurdes', 'Fernanda', 'Alice', 'Leonor', 'Francisca', 'Laura', 'Lúcia', 'Clara', 'Vânia', 'Sónia', 'Bruna', 'Gabriela'];
    portuguese_male_names TEXT[] := ARRAY['João', 'António', 'José', 'Francisco', 'Manuel', 'Pedro', 'Miguel', 'Luís', 'Carlos', 'Paulo', 'Tiago', 'André', 'Rui', 'Ricardo', 'Bruno', 'Nuno', 'Hugo', 'Gonçalo', 'Diogo', 'Fernando', 'Jorge', 'Vítor', 'Rafael', 'Marco', 'Joaquim', 'Mário', 'Sérgio', 'Daniel', 'David', 'Rodrigo', 'Alexandre', 'Renato', 'Filipe', 'Alberto', 'Armando', 'Henrique', 'César', 'Artur', 'Eduardo', 'Raul', 'Guilherme', 'Vasco', 'Tomás', 'Martim', 'Gabriel', 'Bernardo', 'Simão', 'Duarte', 'Afonso', 'Salvador'];
    portuguese_cities TEXT[] := ARRAY['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Setúbal', 'Évora', 'Aveiro', 'Funchal', 'Viseu'];

    i INTEGER;
    country_data RECORD;
BEGIN
    -- Process each country
    FOR country_data IN
        SELECT 'Germany' as country, 'de' as lang, german_female_names as f_names, german_male_names as m_names, german_cities as cities
        UNION ALL
        SELECT 'France', 'fr', french_female_names, french_male_names, french_cities
        UNION ALL
        SELECT 'Spain', 'es', spanish_female_names, spanish_male_names, spanish_cities
        UNION ALL
        SELECT 'Italy', 'it', italian_female_names, italian_male_names, italian_cities
        UNION ALL
        SELECT 'Poland', 'pl', polish_female_names, polish_male_names, polish_cities
        UNION ALL
        SELECT 'Portugal', 'pt', portuguese_female_names, portuguese_male_names, portuguese_cities
    LOOP
        -- Insert 50 female profiles
        FOR i IN 1..50 LOOP
            INSERT INTO public.discovery_profiles (
                name, age, gender, country, language, city, occupation, bio,
                interests, hobbies, icebreakers, is_ai_profile, verified, last_seen
            ) VALUES (
                country_data.f_names[i],
                24 + (i % 7), -- ages 24-30
                'female',
                country_data.country,
                country_data.lang,
                country_data.cities[1 + (i % 10)],
                CASE (i % 10)
                    WHEN 0 THEN 'Marketing Manager'
                    WHEN 1 THEN 'Software Engineer'
                    WHEN 2 THEN 'Designer'
                    WHEN 3 THEN 'Teacher'
                    WHEN 4 THEN 'Nurse'
                    WHEN 5 THEN 'Photographer'
                    WHEN 6 THEN 'Journalist'
                    WHEN 7 THEN 'Chef'
                    WHEN 8 THEN 'Lawyer'
                    ELSE 'Doctor'
                END,
                CASE country_data.lang
                    WHEN 'de' THEN 'Ich liebe es, neue Orte zu entdecken und gutes Essen zu genießen. Auf der Suche nach jemandem mit Humor und Abenteuerlust.'
                    WHEN 'fr' THEN 'J''adore voyager et découvrir de nouveaux endroits. Je cherche quelqu''un avec qui partager de belles aventures.'
                    WHEN 'es' THEN 'Me encanta viajar y descubrir nuevos lugares. Busco a alguien con quien compartir aventuras increíbles.'
                    WHEN 'it' THEN 'Amo viaggiare e scoprire nuovi posti. Cerco qualcuno con cui condividere belle avventure.'
                    WHEN 'pl' THEN 'Uwielbiam podróżować i odkrywać nowe miejsca. Szukam kogoś, z kim mogę dzielić się przygodami.'
                    ELSE 'Adoro viajar e descobrir novos lugares. Procuro alguém com quem partilhar aventuras incríveis.'
                END,
                ARRAY['Travel', 'Coffee', 'Music', 'Art', 'Fitness'],
                ARRAY['Reading', 'Cooking', 'Yoga', 'Dancing', 'Photography'],
                ARRAY['What''s your favorite local spot?', 'Coffee or tea?', 'Best travel destination?'],
                true,
                (random() < 0.3),
                NOW() - (random() * INTERVAL '24 hours')
            );
        END LOOP;

        -- Insert 50 male profiles
        FOR i IN 1..50 LOOP
            INSERT INTO public.discovery_profiles (
                name, age, gender, country, language, city, occupation, bio,
                interests, hobbies, icebreakers, is_ai_profile, verified, last_seen
            ) VALUES (
                country_data.m_names[i],
                25 + (i % 6), -- ages 25-30
                'male',
                country_data.country,
                country_data.lang,
                country_data.cities[1 + (i % 10)],
                CASE (i % 10)
                    WHEN 0 THEN 'Software Developer'
                    WHEN 1 THEN 'Engineer'
                    WHEN 2 THEN 'Entrepreneur'
                    WHEN 3 THEN 'Doctor'
                    WHEN 4 THEN 'Architect'
                    WHEN 5 THEN 'Personal Trainer'
                    WHEN 6 THEN 'Musician'
                    WHEN 7 THEN 'Chef'
                    WHEN 8 THEN 'Lawyer'
                    ELSE 'Pilot'
                END,
                CASE country_data.lang
                    WHEN 'de' THEN 'Technikbegeisterter, der gerne neue Dinge baut. Wenn ich nicht arbeite, bin ich auf Konzerten oder probiere neue Restaurants aus.'
                    WHEN 'fr' THEN 'Passionné de technologie qui aime créer de nouvelles choses. Quand je ne travaille pas, je suis en concert ou j''essaie de nouveaux restaurants.'
                    WHEN 'es' THEN 'Apasionado por la tecnología que ama crear cosas nuevas. Cuando no trabajo, estoy en conciertos o probando nuevos restaurantes.'
                    WHEN 'it' THEN 'Appassionato di tecnologia che ama creare cose nuove. Quando non lavoro, sono ai concerti o provo nuovi ristoranti.'
                    WHEN 'pl' THEN 'Entuzjasta technologii, który uwielbia tworzyć nowe rzeczy. Gdy nie pracuję, jestem na koncertach lub próbuję nowych restauracji.'
                    ELSE 'Apaixonado por tecnologia que adora criar coisas novas. Quando não trabalho, estou em concertos ou experimento novos restaurantes.'
                END,
                ARRAY['Sports', 'Technology', 'Travel', 'Music', 'Fitness'],
                ARRAY['Running', 'Coding', 'Guitar', 'Cooking', 'Photography'],
                ARRAY['Best concert you''ve been to?', 'Favorite weekend activity?', 'Hidden gem restaurant?'],
                true,
                (random() < 0.3),
                NOW() - (random() * INTERVAL '24 hours')
            );
        END LOOP;

        RAISE NOTICE 'Inserted 100 profiles for %', country_data.country;
    END LOOP;
END $$;

-- Verify the total count
DO $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM public.discovery_profiles;
    RAISE NOTICE 'Total profiles in database: %', total_count;
END $$;

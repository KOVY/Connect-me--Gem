-- ========================================
-- 🌍 SEED: 800 Discovery Profiles (AI Generated)
-- 8 countries × 100 profiles (50 female + 50 male)
-- ========================================

-- Helper function to generate random photo URL
CREATE OR REPLACE FUNCTION random_portrait_photo(gender TEXT, seed INTEGER)
RETURNS TEXT AS $$
BEGIN
    -- Using Unsplash API with specific portrait queries
    -- Gender-specific queries ensure appropriate photos
    IF gender = 'female' THEN
        RETURN 'https://images.unsplash.com/photo-' ||
               CASE (seed % 20)
                   WHEN 0 THEN '1438761681033-6461ffad8d80?w=800&h=1000&fit=crop' -- woman portrait
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
                   WHEN 0 THEN '1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop' -- man portrait
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

-- ========================================
-- 🇺🇸 USA PROFILES (EN) - 100 profiles
-- ========================================

-- USA Female Names (50)
WITH usa_female_data AS (
    SELECT * FROM (VALUES
        ('Emma', 28, 'Marketing Manager', 'New York', 'Love exploring new coffee shops and weekend hikes. Looking for someone who can keep up with my energy and make me laugh.'),
        ('Olivia', 25, 'Graphic Designer', 'Los Angeles', 'Creative soul with a passion for art and travel. Seeking adventure and meaningful connections.'),
        ('Ava', 29, 'Software Engineer', 'San Francisco', 'Tech geek by day, foodie by night. Let''s grab tacos and talk about the latest gadgets.'),
        ('Sophia', 27, 'Nurse', 'Chicago', 'Caring heart with a love for helping others. Looking for someone genuine and kind.'),
        ('Isabella', 26, 'Teacher', 'Seattle', 'Book lover and coffee addict. Rainy days are perfect for reading and good conversations.'),
        ('Mia', 30, 'Attorney', 'Boston', 'Ambitious and driven, but I know how to relax. Wine and good company are my favorites.'),
        ('Charlotte', 24, 'Photographer', 'Miami', 'Capturing moments and living life to the fullest. Beach vibes and sunset chaser.'),
        ('Amelia', 28, 'Accountant', 'Dallas', 'Numbers by day, Netflix by night. Looking for my binge-watching partner.'),
        ('Harper', 26, 'Journalist', 'Washington DC', 'Curious mind always seeking truth and good stories. Let''s create our own story.'),
        ('Evelyn', 29, 'Interior Designer', 'Austin', 'Making spaces beautiful and hearts full. Music festivals and tacos are my love language.'),
        ('Abigail', 27, 'Veterinarian', 'Denver', 'Animal lover and outdoor enthusiast. My dog approves this message.'),
        ('Emily', 25, 'Chef', 'Portland', 'Cooking up delicious meals and good times. Foodie adventures await!'),
        ('Luna', 28, 'Yoga Instructor', 'San Diego', 'Finding balance on and off the mat. Namaste and good vibes only.'),
        ('Aria', 26, 'Musician', 'Nashville', 'Living life one song at a time. Looking for harmony in all forms.'),
        ('Scarlett', 30, 'Real Estate Agent', 'Phoenix', 'Helping people find their dream homes. Maybe I can find mine with you?'),
        ('Madison', 24, 'Student', 'Philadelphia', 'Still figuring life out but having fun along the way. Study dates welcome!'),
        ('Layla', 27, 'Fashion Designer', 'Las Vegas', 'Style is my passion, adventure is my lifestyle. Let''s dress up and go out!'),
        ('Chloe', 29, 'Psychologist', 'Minneapolis', 'Understanding minds and hearts. Deep conversations over coffee are my thing.'),
        ('Victoria', 26, 'Pilot', 'Atlanta', 'Taking flights and catching feelings. Let''s see where this journey goes.'),
        ('Grace', 28, 'Pharmacist', 'Houston', 'Healing through medicine and kindness. Looking for my prescription for happiness.'),
        ('Zoe', 25, 'Social Worker', 'San Antonio', 'Making a difference one day at a time. Compassion and empathy matter.'),
        ('Lily', 27, 'Barista', 'San Jose', 'Coffee is my craft, smiles are my specialty. Let''s brew something special.'),
        ('Hannah', 29, 'Financial Analyst', 'Columbus', 'Numbers tell stories. Let me tell you ours.'),
        ('Addison', 26, 'Architect', 'Indianapolis', 'Designing buildings and dreaming big. Let''s build something together.'),
        ('Ellie', 28, 'Personal Trainer', 'Charlotte', 'Fitness enthusiast who loves a good workout and better conversations.'),
        ('Natalie', 24, 'Makeup Artist', 'Detroit', 'Beauty is my canvas. Looking for someone to paint the town with.'),
        ('Aubrey', 27, 'Event Planner', 'Memphis', 'Planning perfect moments. Maybe our first date will be one?'),
        ('Brooklyn', 25, 'Dancer', 'Baltimore', 'Life is better when you dance through it. Let''s move together.'),
        ('Claire', 30, 'Scientist', 'Milwaukee', 'Exploring the mysteries of life. You might be the most interesting one yet.'),
        ('Skylar', 26, 'Flight Attendant', 'Louisville', 'Traveling the world and meeting amazing people. Are you my next adventure?'),
        ('Lucy', 28, 'Writer', 'Portland', 'Storyteller seeking the next chapter. Let''s write it together.'),
        ('Paisley', 27, 'Hairstylist', 'Oklahoma City', 'Making people look and feel their best. Your hair and heart are in good hands.'),
        ('Sarah', 29, 'Doctor', 'Raleigh', 'Healing bodies and seeking someone to heal my heart.'),
        ('Nora', 25, 'Librarian', 'Richmond', 'Books are my escape, but I''m ready for real adventures too.'),
        ('Riley', 26, 'Engineer', 'New Orleans', 'Building things and breaking stereotypes. Jazz and good food complete me.'),
        ('Leah', 28, 'HR Manager', 'Salt Lake City', 'Connecting people professionally, seeking personal connection.'),
        ('Lillian', 24, 'Florist', 'Birmingham', 'Surrounding myself with beauty. You could be the most beautiful part.'),
        ('Savannah', 27, 'Journalist', 'Rochester', 'Telling stories that matter. What''s your story?'),
        ('Audrey', 30, 'Lawyer', 'Grand Rapids', 'Fighting for justice and looking for love. No objections here!'),
        ('Brooklyn', 26, 'Marketing Specialist', 'Tucson', 'Creative campaigns by day, adventures by night.'),
        ('Bella', 25, 'Actress', 'Fresno', 'Living life like it''s a movie. Looking for my co-star.'),
        ('Nova', 28, 'Data Scientist', 'Sacramento', 'Analyzing patterns in data, hoping to find a pattern with you.'),
        ('Stella', 27, 'Dental Hygienist', 'Kansas City', 'Keeping smiles bright. Hope to make you smile too.'),
        ('Violet', 29, 'Environmental Scientist', 'Mesa', 'Saving the planet one day at a time. Join my mission?'),
        ('Aurora', 26, 'Therapist', 'Virginia Beach', 'Listening with empathy, speaking with kindness.'),
        ('Hazel', 24, 'Barista', 'Omaha', 'Crafting the perfect latte and perfect moments.'),
        ('Willow', 28, 'Physical Therapist', 'Oakland', 'Helping people heal and move better. Let''s move forward together.'),
        ('Ivy', 27, 'Social Media Manager', 'Arlington', 'Creating content and connections. Swipe right for the DM of your life.'),
        ('Autumn', 25, 'Teacher', 'Wichita', 'Educating young minds, learning about life every day.'),
        ('Ruby', 30, 'Sommelier', 'Anaheim', 'Wine expert seeking the perfect pairing. Could that be us?')
    ) AS profiles(name, age, occupation, city, bio)
),
usa_female_interests AS (
    SELECT ARRAY['Travel', 'Coffee', 'Hiking', 'Photography', 'Music', 'Fitness', 'Cooking', 'Reading', 'Yoga', 'Art'] AS interests
),
usa_female_hobbies AS (
    SELECT ARRAY['Running', 'Painting', 'Guitar', 'Swimming', 'Dancing', 'Baking', 'Gardening', 'Cycling', 'Meditation', 'Writing'] AS hobbies
),
usa_female_icebreakers AS (
    SELECT ARRAY[
        'What''s your favorite local spot in the city?',
        'Coffee or tea - and how do you take it?',
        'Best travel destination you''ve been to?'
    ] AS icebreakers
)
INSERT INTO public.discovery_profiles (name, age, gender, country, language, city, occupation, bio, interests, hobbies, icebreakers, is_ai_profile, verified, last_seen)
SELECT
    d.name,
    d.age,
    'female',
    'USA',
    'en',
    d.city,
    d.occupation,
    d.bio,
    (SELECT interests FROM usa_female_interests),
    (SELECT hobbies FROM usa_female_hobbies),
    (SELECT icebreakers FROM usa_female_icebreakers),
    true,
    (random() < 0.3), -- 30% verified
    NOW() - (random() * INTERVAL '24 hours')
FROM usa_female_data d;

-- USA Male Names (50)
WITH usa_male_data AS (
    SELECT * FROM (VALUES
        ('Liam', 30, 'Software Developer', 'New York', 'Tech enthusiast who loves building cool apps. When I''m not coding, you''ll find me at concerts or trying new restaurants.'),
        ('Noah', 28, 'Firefighter', 'Los Angeles', 'Saving lives by day, living life by night. Fitness junkie with a heart of gold.'),
        ('Oliver', 27, 'Entrepreneur', 'San Francisco', 'Building my dream startup. Looking for someone to share the journey with.'),
        ('Elijah', 29, 'Doctor', 'Chicago', 'Healing hearts professionally, seeking someone to heal mine personally.'),
        ('James', 26, 'Architect', 'Seattle', 'Designing buildings and dreaming big. Let''s design our future together.'),
        ('William', 31, 'Investment Banker', 'Boston', 'Finance by day, fun by night. Work hard, play harder mentality.'),
        ('Benjamin', 25, 'Personal Trainer', 'Miami', 'Fitness is my passion. Looking for a workout partner and life partner.'),
        ('Lucas', 28, 'Pilot', 'Dallas', 'Taking you to new heights, literally. Adventure seeker with a pilot''s license.'),
        ('Henry', 27, 'Journalist', 'Washington DC', 'Telling stories that matter. What''s your story?'),
        ('Alexander', 30, 'Music Producer', 'Austin', 'Creating beats and living life in rhythm. Music festivals are my happy place.'),
        ('Mason', 26, 'Veterinarian', 'Denver', 'Animal lover with a big heart. My dog will love you too.'),
        ('Michael', 29, 'Chef', 'Portland', 'Cooking up delicious meals. Let me cook for you sometime?'),
        ('Ethan', 27, 'Physical Therapist', 'San Diego', 'Helping people feel better. Beach workouts and sunset runs are my thing.'),
        ('Daniel', 25, 'Musician', 'Nashville', 'Living for music and good vibes. Let''s create harmony together.'),
        ('Matthew', 30, 'Real Estate Developer', 'Phoenix', 'Building dreams and making them reality. What''s your dream?'),
        ('Aiden', 24, 'Graduate Student', 'Philadelphia', 'Still learning but loving the journey. Study dates and coffee chats welcome!'),
        ('Jackson', 28, 'Marketing Director', 'Las Vegas', 'Creating campaigns and making connections. Let''s make this one count.'),
        ('Logan', 29, 'Therapist', 'Minneapolis', 'Listening is my superpower. Deep conversations over wine are my favorite.'),
        ('David', 27, 'Commercial Pilot', 'Atlanta', 'Frequent flyer seeking someone to ground me. Travel stories for days.'),
        ('Joseph', 26, 'Pharmacist', 'Houston', 'Helping people stay healthy. Looking for my daily dose of happiness.'),
        ('Samuel', 28, 'Social Entrepreneur', 'San Antonio', 'Making a difference through business. Purpose-driven and passionate.'),
        ('Sebastian', 25, 'Barista', 'San Jose', 'Coffee expert and morning person. Let me make you the perfect cup.'),
        ('Carter', 30, 'Financial Advisor', 'Columbus', 'Planning futures professionally, seeking someone to plan mine with.'),
        ('Wyatt', 27, 'Civil Engineer', 'Indianapolis', 'Building infrastructure and strong foundations. Let''s build ours.'),
        ('Owen', 26, 'Personal Coach', 'Charlotte', 'Motivating people to be their best. You motivate me already.'),
        ('Jack', 24, 'Photographer', 'Detroit', 'Capturing beautiful moments. You''d make a perfect subject.'),
        ('Luke', 29, 'Event Manager', 'Memphis', 'Planning unforgettable experiences. Our first date will be one.'),
        ('Gabriel', 25, 'Professional Dancer', 'Baltimore', 'Dancing through life. Care to join?'),
        ('Anthony', 31, 'Research Scientist', 'Milwaukee', 'Curious about everything. Especially curious about you.'),
        ('Isaac', 26, 'Flight Attendant', 'Louisville', 'Traveling the world professionally. Looking for my travel buddy.'),
        ('Dylan', 28, 'Novelist', 'Portland', 'Writing stories and living adventures. Let''s write ours.'),
        ('John', 27, 'Barber', 'Oklahoma City', 'Keeping people sharp and looking good. Your hair and heart are safe with me.'),
        ('Andrew', 30, 'Surgeon', 'Raleigh', 'Precision is my profession. Looking for someone who gets me.'),
        ('Christian', 25, 'Book Editor', 'Richmond', 'Words are my world. Let''s talk books and life.'),
        ('Joshua', 26, 'Mechanical Engineer', 'New Orleans', 'Building machines and breaking stereotypes. Jazz and good food lover.'),
        ('Christopher', 28, 'Product Manager', 'Salt Lake City', 'Creating products people love. Hope you''ll love getting to know me.'),
        ('Ryan', 24, 'Landscape Designer', 'Birmingham', 'Creating beautiful spaces. Let''s create something beautiful together.'),
        ('Nathan', 29, 'News Anchor', 'Rochester', 'Delivering news with a smile. What''s new with you?'),
        ('Isaac', 27, 'Corporate Lawyer', 'Grand Rapids', 'Justice is my passion. Looking for my partner in everything.'),
        ('Hunter', 26, 'Brand Manager', 'Tucson', 'Building brands and relationships. Let''s build ours.'),
        ('Caleb', 25, 'Actor', 'Fresno', 'Living life on stage and off. Drama-free zone though!'),
        ('Thomas', 30, 'Data Engineer', 'Sacramento', 'Turning data into insights. Hope to gain insight into your heart.'),
        ('Jordan', 28, 'Dentist', 'Kansas City', 'Making smiles brighter. Can I brighten yours?'),
        ('Connor', 27, 'Conservation Officer', 'Mesa', 'Protecting nature and seeking natural connection.'),
        ('Landon', 26, 'Counselor', 'Virginia Beach', 'Helping people find their way. Found my way to your profile.'),
        ('Adrian', 24, 'Barista', 'Omaha', 'Brewing the perfect cup. Looking to brew something special with you.'),
        ('Jonathan', 29, 'Chiropractor', 'Oakland', 'Aligning bodies and seeking soul alignment.'),
        ('Nolan', 27, 'Content Creator', 'Arlington', 'Creating content that connects. Let''s connect IRL.'),
        ('Cameron', 25, 'High School Teacher', 'Wichita', 'Shaping young minds, learning every day.'),
        ('Ezra', 30, 'Wine Distributor', 'Anaheim', 'Wine connoisseur seeking the perfect pairing.')
    ) AS profiles(name, age, occupation, city, bio)
),
usa_male_interests AS (
    SELECT ARRAY['Sports', 'Technology', 'Travel', 'Music', 'Fitness', 'Cooking', 'Photography', 'Gaming', 'Movies', 'Reading'] AS interests
),
usa_male_hobbies AS (
    SELECT ARRAY['Basketball', 'Coding', 'Guitar', 'Running', 'Cycling', 'Hiking', 'Gaming', 'Cooking', 'Photography', 'Woodworking'] AS hobbies
),
usa_male_icebreakers AS (
    SELECT ARRAY[
        'Best concert or show you''ve been to?',
        'What''s your go-to weekend activity?',
        'Favorite local restaurant or hidden gem?'
    ] AS icebreakers
)
INSERT INTO public.discovery_profiles (name, age, gender, country, language, city, occupation, bio, interests, hobbies, icebreakers, is_ai_profile, verified, last_seen)
SELECT
    d.name,
    d.age,
    'male',
    'USA',
    'en',
    d.city,
    d.occupation,
    d.bio,
    (SELECT interests FROM usa_male_interests),
    (SELECT hobbies FROM usa_male_hobbies),
    (SELECT icebreakers FROM usa_male_icebreakers),
    true,
    (random() < 0.3),
    NOW() - (random() * INTERVAL '24 hours')
FROM usa_male_data d;

-- This is part 1 of the seed file (USA profiles)
-- Continue with other countries in separate parts

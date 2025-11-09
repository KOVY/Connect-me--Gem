-- ========================================
-- 🇨🇿 CZECH REPUBLIC PROFILES (CS) - 100 profiles
-- České jména, města a bio v češtině
-- ========================================

-- Czech Female Names (50)
WITH czech_female_data AS (
    SELECT * FROM (VALUES
        ('Tereza', 27, 'Marketingová manažerka', 'Praha', 'Miluji cestování, dobrou kávu a zkoušet nové restaurace. Hledám někoho, kdo má smysl pro humor a rád objevuje nová místa.'),
        ('Lucie', 25, 'Grafická designérka', 'Brno', 'Kreativní duše s láskou k umění a fotografii. Hledám někoho, kdo rozumí mé vášni pro design.'),
        ('Karolína', 28, 'Softwarová inženýrka', 'Praha', 'Geek ve dne, foodie v noci. Pojďme si dát dobré jídlo a popovídat si o technologiích.'),
        ('Anna', 26, 'Zdravotní sestra', 'Ostrava', 'Pečující srdce s láskou k pomoci druhým. Hledám někoho upřímného a laskavého.'),
        ('Eliška', 29, 'Učitelka', 'Plzeň', 'Milovnice knih a kávy. Deštivé dny jsou ideální na čtení a dobré povídání.'),
        ('Veronika', 30, 'Advokátka', 'Praha', 'Ambiciózní a cílevědomá, ale umím si odpočinout. Víno a dobrá společnost jsou moje oblíbené.'),
        ('Barbora', 24, 'Fotografka', 'Liberec', 'Zachycuji okamžiky a žiju naplno. Hory a příroda jsou moje srdcovka.'),
        ('Klára', 27, 'Účetní', 'České Budějovice', 'Čísla ve dne, Netflix v noci. Hledám svého partnera na seriálové maratony.'),
        ('Nikola', 26, 'Novinářka', 'Praha', 'Zvídavá mysl vždy hledající pravdu a dobré příběhy. Pojďme vytvořit náš vlastní příběh.'),
        ('Adéla', 28, 'Interiérová designérka', 'Brno', 'Dělám prostory krásnými a srdce šťastnými. Hudební festivaly a dobré jídlo jsou moje láska.'),
        ('Natálie', 27, 'Veterinářka', 'Hradec Králové', 'Milovnice zvířat a přírody. Můj pes tuto zprávu schvaluje.'),
        ('Kristýna', 25, 'Šéfkuchařka', 'Praha', 'Vaření vynikajících jídel a skvělých chvil. Gastronomická dobrodružství čekají!'),
        ('Michaela', 29, 'Instruktorka jógy', 'Olomouc', 'Nacházím rovnováhu na podložce i mimo ni. Jen dobré energie!'),
        ('Simona', 26, 'Muzikantka', 'Brno', 'Žiju život jednu píseň po druhé. Hledám harmonii ve všech formách.'),
        ('Daniela', 30, 'Realitní makléřka', 'Pardubice', 'Pomáhám lidem najít jejich vysněné domovy. Možná najdu svůj s tebou?'),
        ('Petra', 24, 'Studentka', 'Praha', 'Stále zjišťuji, co chci od života, ale bavím se cestou. Rande při studiu vítána!'),
        ('Martina', 28, 'Módní návrhářka', 'Brno', 'Styl je moje vášeň, dobrodružství můj životní styl. Pojďme se obléknout a vyrazit!'),
        ('Jana', 27, 'Psycholožka', 'Zlín', 'Rozumím myslím a srdcím. Hluboké konverzace u kávy jsou moje věc.'),
        ('Lenka', 29, 'Pilotka', 'Praha', 'Létám letadly a zachycuji city. Pojďme se podívat, kam nás to zavede.'),
        ('Monika', 26, 'Lékárnice', 'Jihlava', 'Léčím pomocí medicíny a laskavosti. Hledám svůj recept na štěstí.'),
        ('Zuzana', 25, 'Sociální pracovnice', 'Karlovy Vary', 'Dělám rozdíl každý den. Soucit a empatie jsou důležité.'),
        ('Ivana', 28, 'Baristka', 'Praha', 'Káva je moje řemeslo, úsměvy moje specialita. Pojďme uvařit něco výjimečného.'),
        ('Hana', 27, 'Finanční analytička', 'Brno', 'Čísla vyprávějí příběhy. Nech mě vyprávět ten náš.'),
        ('Denisa', 26, 'Architektka', 'Ostrava', 'Navrhuju budovy a sním velké sny. Pojďme něco společně postavit.'),
        ('Markéta', 29, 'Osobní trenérka', 'Praha', 'Nadšenec pro fitness, který miluje dobré cvičení a lepší rozhovory.'),
        ('Kateřina', 24, 'Vizážistka', 'Ústí nad Labem', 'Krása je moje plátno. Hledám někoho, s kým vymalovat město.'),
        ('Andrea', 27, 'Event manažerka', 'Brno', 'Plánuju dokonalé okamžiky. Možná naše první rande bude jedním z nich?'),
        ('Pavla', 25, 'Tanečnice', 'Praha', 'Život je lepší, když jím tančíš. Pojďme se hýbat společně.'),
        ('Eva', 30, 'Vědkyně', 'Liberec', 'Zkoumám záhady života. Možná jsi ten nejzajímavější z nich.'),
        ('Radka', 26, 'Letuška', 'Praha', 'Cestuju po světě a potkávám úžasné lidi. Jsi moje další dobrodružství?'),
        ('Alena', 28, 'Spisovatelka', 'Brno', 'Vypravěčka hledající další kapitolu. Pojďme ji napsat společně.'),
        ('Iveta', 27, 'Kadeřnice', 'Plzeň', 'Dělám lidi krásnými a šťastnými. Tvoje vlasy i srdce jsou v bezpečí.'),
        ('Renata', 29, 'Doktorka', 'Praha', 'Léčím těla a hledám někoho, kdo vyléčí moje srdce.'),
        ('Dagmar', 25, 'Knihovnice', 'České Budějovice', 'Knihy jsou můj únik, ale jsem připravená na skutečná dobrodružství.'),
        ('Romana', 26, 'Inženýrka', 'Ostrava', 'Stavím věci a boří stereotypy. Dobrá muzika a jídlo mě naplňují.'),
        ('Ludmila', 28, 'HR manažerka', 'Brno', 'Spojuji lidi profesně, hledám osobní spojení.'),
        ('Blanka', 24, 'Květinářka', 'Pardubice', 'Obklopuji se krásou. Mohl bys být ta nejkrásnější část.'),
        ('Šárka', 27, 'Novinářka', 'Praha', 'Vyprávím příběhy, které mají význam. Jaký je tvůj příběh?'),
        ('Lenka', 30, 'Právnička', 'Brno', 'Bojuju za spravedlnost a hledám lásku. Žádné námitky!'),
        ('Jitka', 26, 'Marketingová specialistka', 'Ostrava', 'Kreativní kampaně ve dne, dobrodružství v noci.'),
        ('Ivana', 25, 'Herečka', 'Praha', 'Žiju život jako film. Hledám svého partnera před kamerou.'),
        ('Gabriela', 28, 'Datová analytička', 'Brno', 'Analyzuji vzorce v datech, doufám najít vzorec s tebou.'),
        ('Kamila', 27, 'Zubní hygienistka', 'Liberec', 'Udržuji úsměvy zářivé. Doufám, že tě taky rozesměju.'),
        ('Věra', 29, 'Enviromentální vědkyně', 'Praha', 'Zachraňuji planetu jeden den po druhém. Přidáš se k mé misi?'),
        ('Olga', 26, 'Terapeutka', 'Olomouc', 'Naslouchám s empatií, mluvím s laskavostí.'),
        ('Irena', 24, 'Baristka', 'Brno', 'Vytvářím perfektní latte a perfektní okamžiky.'),
        ('Milena', 28, 'Fyzioterapeutka', 'Praha', 'Pomáhám lidem uzdravit se a pohybovat se lépe. Pojďme vpřed společně.'),
        ('Stanislava', 27, 'Social media manažerka', 'Ostrava', 'Tvořím obsah a spojení. Swipni doprava pro DM tvého života.'),
        ('Božena', 25, 'Učitelka', 'Plzeň', 'Vzděl ávám mladé mysli, učím se o životě každý den.'),
        ('Růžena', 30, 'Someliérka', 'Praha', 'Expertka na víno hledající dokonalé spojení. Mohli bychom to být my?')
    ) AS profiles(name, age, occupation, city, bio)
),
czech_female_interests AS (
    SELECT ARRAY['Cestování', 'Káva', 'Turistika', 'Fotografie', 'Hudba', 'Fitness', 'Vaření', 'Čtení', 'Jóga', 'Umění'] AS interests
),
czech_female_hobbies AS (
    SELECT ARRAY['Běhání', 'Malování', 'Kytara', 'Plavání', 'Tanec', 'Pečení', 'Zahradničení', 'Cyklistika', 'Meditace', 'Psaní'] AS hobbies
),
czech_female_icebreakers AS (
    SELECT ARRAY[
        'Jaké je tvoje oblíbené místo v Praze?',
        'Káva nebo čaj - a jak to máš nejraději?',
        'Nejlepší místo, kde jsi cestoval/a?'
    ] AS icebreakers
)
INSERT INTO public.discovery_profiles (name, age, gender, country, language, city, occupation, bio, interests, hobbies, icebreakers, is_ai_profile, verified, last_seen)
SELECT
    d.name,
    d.age,
    'female',
    'Czech Republic',
    'cs',
    d.city,
    d.occupation,
    d.bio,
    (SELECT interests FROM czech_female_interests),
    (SELECT hobbies FROM czech_female_hobbies),
    (SELECT icebreakers FROM czech_female_icebreakers),
    true,
    (random() < 0.3),
    NOW() - (random() * INTERVAL '24 hours')
FROM czech_female_data d;

-- Czech Male Names (50)
WITH czech_male_data AS (
    SELECT * FROM (VALUES
        ('Jan', 30, 'Vývojář softwaru', 'Praha', 'Technologický nadšenec, který miluje tvorbu skvělých aplikací. Když nekóduji, najdeš mě na koncertech nebo zkouším nové restaurace.'),
        ('Petr', 28, 'Hasič', 'Brno', 'Zachraňuji životy ve dne, žiju naplno v noci. Fitness fanatik se zlatým srdcem.'),
        ('Martin', 27, 'Podnikatel', 'Praha', 'Stavím svůj vysněný startup. Hledám někoho, s kým sdílet cestu.'),
        ('Tomáš', 29, 'Doktor', 'Ostrava', 'Léčím srdce profesně, hledám někoho, kdo vyléčí moje osobně.'),
        ('Jakub', 26, 'Architekt', 'Plzeň', 'Navrhuju budovy a sním velké sny. Pojďme navrhnout naši budoucnost společně.'),
        ('Lukáš', 31, 'Investiční bankéř', 'Praha', 'Finance ve dne, zábava v noci. Tvrdě pracuji, tvrdě si užívám.'),
        ('David', 25, 'Osobní trenér', 'Liberec', 'Fitness je moje vášeň. Hledám workout partnera a životního partnera.'),
        ('Michal', 28, 'Pilot', 'Praha', 'Vezmu tě do nových výšin, doslova. Hledač dobrodružství s pilotní licencí.'),
        ('Filip', 27, 'Novinář', 'Brno', 'Vyprávím příběhy, které mají smysl. Jaký je tvůj příběh?'),
        ('Daniel', 30, 'Hudební producent', 'Ostrava', 'Tvořím beaty a žiju život v rytmu. Hudební festivaly jsou moje šťastné místo.'),
        ('Pavel', 26, 'Veterinář', 'Hradec Králové', 'Milovník zvířat s velkým srdcem. Můj pes tě taky bude milovat.'),
        ('Marek', 29, 'Šéfkuchař', 'Praha', 'Vařím vynikající jídla. Nechám ti někdy něco uvařit?'),
        ('Ondřej', 27, 'Fyzioterapeut', 'České Budějovice', 'Pomáhám lidem cítit se lépe. Pláže a západy slunce jsou moje věc.'),
        ('Jiří', 25, 'Muzikant', 'Brno', 'Žiju pro hudbu a dobré vibrace. Pojďme vytvořit harmonii společně.'),
        ('Vojtěch', 30, 'Realitní developer', 'Pardubice', 'Stavím sny a dělám je skutečností. Jaký je tvůj sen?'),
        ('Adam', 24, 'Student', 'Praha', 'Stále se učím, ale miluji cestu. Studijní randa a kávové chaty vítány!'),
        ('Matěj', 28, 'Marketingový ředitel', 'Zlín', 'Tvořím kampaně a navazuji spojení. Pojďme to nechat spočítat.'),
        ('Roman', 29, 'Terapeut', 'Brno', 'Naslouchání je moje superschopnost. Hluboké konverzace u vína jsou moje oblíbené.'),
        ('Patrik', 27, 'Komerční pilot', 'Praha', 'Častý letec hledající někoho, kdo mě uzemní. Cestovatelské příběhy na dny.'),
        ('Radek', 26, 'Lékárník', 'Ostrava', 'Pomáhám lidem zůstat zdraví. Hledám svou denní dávku štěstí.'),
        ('Vít', 28, 'Sociální podnikatel', 'Olomouc', 'Dělám rozdíl prostřednictvím byznysu. Účelem řízený a vášnivý.'),
        ('Aleš', 25, 'Barista', 'Praha', 'Expert na kávu a ranní ptáče. Nech mě ti udělat perfektní šálek.'),
        ('Stanislav', 30, 'Finanční poradce', 'Brno', 'Plánuji budoucnosti profesně, hledám někoho, s kým naplánovat svou.'),
        ('Miroslav', 27, 'Stavební inženýr', 'Liberec', 'Stavím infrastrukturu a silné základy. Pojďme postavit naše.'),
        ('Zdeněk', 26, 'Osobní kouč', 'Praha', 'Motivuji lidi být jejich nejlepší verzí. Už mě motivuješ.'),
        ('Karel', 24, 'Fotograf', 'Ostrava', 'Zachycuji krásné okamžiky. Byl bys perfektní subjekt.'),
        ('Josef', 29, 'Event manažer', 'Brno', 'Plánuji nezapomenutelné zážitky. Naše první rande jím bude.'),
        ('Vladimír', 25, 'Profesionální tanečník', 'Praha', 'Tančím životem. Chceš se přidat?'),
        ('Antonín', 31, 'Výzkumný vědec', 'Plzeň', 'Jsem zvědavý na všechno. Zvlášť zvědavý na tebe.'),
        ('Miloslav', 26, 'Letuška', 'Praha', 'Cestuji po světě profesně. Hledám svého cestovního parťáka.'),
        ('Václav', 28, 'Romanopisec', 'Brno', 'Píšu příběhy a žiju dobrodružství. Pojďme napsat náš.'),
        ('Bohumil', 27, 'Holič', 'Ostrava', 'Udržuji lidi ostré a vypadající dobře. Tvoje vlasy i srdce jsou v bezpečí u mě.'),
        ('Jaroslav', 30, 'Chirurg', 'Praha', 'Přesnost je moje profese. Hledám někoho, kdo mě chápe.'),
        ('Ladislav', 25, 'Editor knih', 'Liberec', 'Slova jsou můj svět. Pojďme mluvit o knihách a životě.'),
        ('Rostislav', 26, 'Mechanický inženýr', 'Brno', 'Stavím stroje a bořím stereotypy. Milovník jazzu a dobrého jídla.'),
        ('Bohuslav', 28, 'Produktový manažer', 'Praha', 'Tvořím produkty, které lidi milují. Doufám, že budeš milovat poznat mě.'),
        ('Lubomír', 24, 'Zahradní architekt', 'Pardubice', 'Tvořím krásné prostory. Pojďme vytvořit něco krásného společně.'),
        ('Oldřich', 29, 'Zpravodajský moderátor', 'Ostrava', 'Dodávám zprávy s úsměvem. Co je nového s tebou?'),
        ('Radomír', 27, 'Právník společnosti', 'Praha', 'Spravedlnost je moje vášeň. Hledám svého partnera ve všem.'),
        ('Vlastimil', 26, 'Brand manažer', 'Brno', 'Stavím značky a vztahy. Pojďme postavit náš.'),
        ('Čeněk', 25, 'Herec', 'Praha', 'Žiju život na jevišti i mimo něj. Bezproblémová zóna ale!'),
        ('Dušan', 30, 'Datový inženýr', 'Ostrava', 'Měním data na poznatky. Doufám získat pohled do tvého srdce.'),
        ('Emil', 28, 'Zubař', 'Brno', 'Dělám úsměvy jasnějšími. Můžu rozjasnit tvůj?'),
        ('Ferdinand', 27, 'Ochránce přírody', 'Liberec', 'Chráním přírodu a hledám přírodní spojení.'),
        ('Gustav', 26, 'Poradce', 'Praha', 'Pomáhám lidem najít jejich cestu. Našel jsem cestu k tvému profilu.'),
        ('Hynek', 24, 'Barista', 'Olomouc', 'Vařím perfektní šálek. Hledám uvařit něco speciálního s tebou.'),
        ('Ilja', 29, 'Chiropraktik', 'Ostrava', 'Srovnávám těla a hledám soulad duší.'),
        ('Julius', 27, 'Tvůrce obsahu', 'Brno', 'Tvořím obsah, který spojuje. Pojďme se spojit v reálném životě.'),
        ('Kristián', 25, 'Středoškolský učitel', 'Praha', 'Formuju mladé mysli, učím se každý den.'),
        ('Leopold', 30, 'Distributor vína', 'Brno', 'Znalec vín hledající dokonalé spojení.')
    ) AS profiles(name, age, occupation, city, bio)
),
czech_male_interests AS (
    SELECT ARRAY['Sport', 'Technologie', 'Cestování', 'Hudba', 'Fitness', 'Vaření', 'Fotografie', 'Gaming', 'Filmy', 'Čtení'] AS interests
),
czech_male_hobbies AS (
    SELECT ARRAY['Fotbal', 'Kódování', 'Kytara', 'Běhání', 'Cyklistika', 'Turistika', 'Gaming', 'Vaření', 'Fotografie', 'Truhlářství'] AS hobbies
),
czech_male_icebreakers AS (
    SELECT ARRAY[
        'Nejlepší koncert nebo show, na které jsi byl?',
        'Jaká je tvoje oblíbená víkendová aktivita?',
        'Oblíbená místní restaurace nebo skrytý klenot?'
    ] AS icebreakers
)
INSERT INTO public.discovery_profiles (name, age, gender, country, language, city, occupation, bio, interests, hobbies, icebreakers, is_ai_profile, verified, last_seen)
SELECT
    d.name,
    d.age,
    'male',
    'Czech Republic',
    'cs',
    d.city,
    d.occupation,
    d.bio,
    (SELECT interests FROM czech_male_interests),
    (SELECT hobbies FROM czech_male_hobbies),
    (SELECT icebreakers FROM czech_male_icebreakers),
    true,
    (random() < 0.3),
    NOW() - (random() * INTERVAL '24 hours')
FROM czech_male_data d;

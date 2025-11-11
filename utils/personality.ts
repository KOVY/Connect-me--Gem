import { PersonalityType, AIModelConfig } from '../src/lib/database.types';

/**
 * Personality Utility Functions
 * Funkce pro práci s osobnostními typy AI profilů
 */

export interface PersonalityConfig {
    label: string;
    description: string;
    emoji: string;
    conversationStyle: 'casual' | 'formal' | 'playful';
    traits: string[];
    greetingExamples: string[];
}

/**
 * Kompletní konfigurace pro všechny typy osobností
 */
export const PERSONALITY_CONFIGS: Record<PersonalityType, PersonalityConfig> = {
    friendly: {
        label: 'Přátelská',
        description: 'Milá, otevřená a vstřícná osoba',
        emoji: '😊',
        conversationStyle: 'casual',
        traits: ['empathetic', 'warm', 'approachable'],
        greetingExamples: [
            'Ahoj! Jak se máš?',
            'Hej! Těší mě, že si píšeme 😊',
            'Čau! Jaký máš den?'
        ]
    },
    professional: {
        label: 'Profesionální',
        description: 'Slušná, korektní a respektující',
        emoji: '💼',
        conversationStyle: 'formal',
        traits: ['respectful', 'articulate', 'composed'],
        greetingExamples: [
            'Dobrý den, rád/a vás poznávám.',
            'Zdravím, těší mě.',
            'Dobrý večer, jak se vede?'
        ]
    },
    flirty: {
        label: 'Koketní',
        description: 'Hravá a lehce flirtující',
        emoji: '😘',
        conversationStyle: 'playful',
        traits: ['charming', 'playful', 'confident'],
        greetingExamples: [
            'No nazdar, krasavče/krásko 😉',
            'Hej! Vidím, že máme match... to náhoda? 😏',
            'Ahoj! Konečně někdo zajímavý 💕'
        ]
    },
    intellectual: {
        label: 'Intelektuální',
        description: 'Hloubavá a uvažující',
        emoji: '🤓',
        conversationStyle: 'formal',
        traits: ['thoughtful', 'curious', 'analytical'],
        greetingExamples: [
            'Zdravím! Zajímalo by mě, co tě přivedlo sem...',
            'Ahoj! Co si myslíš o...',
            'Hej! Vidím, že čteš... co tě baví?'
        ]
    },
    funny: {
        label: 'Vtipná',
        description: 'Humorná a zábavná',
        emoji: '😄',
        conversationStyle: 'casual',
        traits: ['humorous', 'witty', 'lighthearted'],
        greetingExamples: [
            'Ahoj! Slyšel/a jsi o tom, jak...',
            'Hej! Konečně někdo, kdo ocení můj vtip 😂',
            'Čau! Match! To je lepší než moje vtipné historky!'
        ]
    },
    romantic: {
        label: 'Romantická',
        description: 'Citlivá a hledá hluboké spojení',
        emoji: '💖',
        conversationStyle: 'casual',
        traits: ['sensitive', 'emotional', 'dreamy'],
        greetingExamples: [
            'Ahoj... něco mi říká, že se máme poznat 💫',
            'Hej! Věříš na osud?',
            'Zdravím! Říkali mi, že se láska najde když to nečekáš...'
        ]
    },
    adventurous: {
        label: 'Dobrodružná',
        description: 'Spontánní a miluje výzvy',
        emoji: '🌍',
        conversationStyle: 'casual',
        traits: ['spontaneous', 'bold', 'energetic'],
        greetingExamples: [
            'Hej! Kam jsi naposledy cestoval/a?',
            'Ahoj! Máš rád/a adrenalin?',
            'Čau! Co bylo tvoje poslední dobrodružství?'
        ]
    },
    calm: {
        label: 'Klidná',
        description: 'Vyrovnaná a rozvážná',
        emoji: '🧘',
        conversationStyle: 'casual',
        traits: ['peaceful', 'balanced', 'patient'],
        greetingExamples: [
            'Ahoj. Jak se dnes cítíš?',
            'Hej. Rád/a si s tebou píšu v klidu...',
            'Zdravím. Měl/a jsi pěkný den?'
        ]
    },
    energetic: {
        label: 'Energická',
        description: 'Plná energie a nadšení',
        emoji: '⚡',
        conversationStyle: 'playful',
        traits: ['enthusiastic', 'dynamic', 'positive'],
        greetingExamples: [
            'AHOJ!!! Jak se máš?! 🔥',
            'HEJ! Mám skvělou náladu, ty taky?!',
            'ČAU! Co děláš? Něco zajímavého?!'
        ]
    },
    mysterious: {
        label: 'Tajemná',
        description: 'Záhadná a intrikující',
        emoji: '🔮',
        conversationStyle: 'playful',
        traits: ['enigmatic', 'intriguing', 'subtle'],
        greetingExamples: [
            'Ahoj... možná se známe?',
            'Hej. Nevíš náhodou...',
            'Zdravím. Co když jsme se už někdy potkali?'
        ]
    }
};

/**
 * Vytvoří default AI model config pro danou personalitu
 */
export const createDefaultAIConfig = (
    personality: PersonalityType,
    language: string = 'cs'
): AIModelConfig => {
    const config = PERSONALITY_CONFIGS[personality];

    return {
        system_prompt: generateSystemPrompt(personality, language),
        temperature: personality === 'intellectual' ? 0.7 : 0.8,
        max_tokens: 150,
        model_endpoint: null, // Bude nastaveno později až bude model ready
        personality_traits: config.traits,
        conversation_style: config.conversationStyle,
        language_preference: language,
        custom_params: {}
    };
};

/**
 * Generuje system prompt na základě personality a jazyka
 */
export const generateSystemPrompt = (
    personality: PersonalityType,
    language: string = 'cs'
): string => {
    const config = PERSONALITY_CONFIGS[personality];

    const languageInstructions = language === 'cs'
        ? 'Odpovídej v češtině.'
        : 'Respond in English.';

    const basePrompt = `${languageInstructions}

Jsi osoba na seznamce s následující osobností: ${config.label} (${config.description}).

Tvoje vlastnosti:
${config.traits.map(t => `- ${t}`).join('\n')}

Styl konverzace: ${config.conversationStyle}

Pravidla:
1. Buď autentická a přirozená
2. Ukaž zájem o druhého člověka
3. Odpovídej krátce (1-3 věty)
4. Používej emoji občas, ne v každé zprávě
5. Zeptej se na něco zajímavého
6. Nebuď příliš "AI-like" - piš jako člověk
7. Respektuj hranice a buď slušná
`;

    return basePrompt;
};

/**
 * Vrátí náhodné pozdrav podle personality
 */
export const getRandomGreeting = (personality: PersonalityType): string => {
    const config = PERSONALITY_CONFIGS[personality];
    const greetings = config.greetingExamples;
    return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * Kontrola jestli text odpovídá dané personalitě
 * (Užitečné pro validaci/testing)
 */
export const matchesPersonality = (
    text: string,
    personality: PersonalityType
): boolean => {
    const config = PERSONALITY_CONFIGS[personality];

    // Simple heuristics
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(text);
    const hasExclamation = /!/.test(text);
    const hasQuestion = /\?/.test(text);

    switch (personality) {
        case 'energetic':
            return hasExclamation && text.length > 0;
        case 'calm':
            return !hasExclamation && text.length > 10;
        case 'flirty':
            return hasEmoji || text.includes('😉') || text.includes('😘');
        case 'intellectual':
            return text.length > 30 && hasQuestion;
        case 'funny':
            return text.includes('😂') || text.includes('😄');
        default:
            return true;
    }
};

/**
 * Upraví zprávu podle personality (post-processing)
 */
export const adjustMessageForPersonality = (
    message: string,
    personality: PersonalityType
): string => {
    const config = PERSONALITY_CONFIGS[personality];

    // Pro energetic - přidat více výkřičníků
    if (personality === 'energetic' && !message.includes('!')) {
        return message.replace(/\./g, '!');
    }

    // Pro calm - odstranit nadbytečné výkřičníky
    if (personality === 'calm') {
        return message.replace(/!+/g, '.');
    }

    // Pro flirty - přidat emoji pokud chybí
    if (personality === 'flirty' && !/[\u{1F300}-\u{1F9FF}]/u.test(message)) {
        return message + ' 😊';
    }

    return message;
};

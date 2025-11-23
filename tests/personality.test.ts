import { describe, it, expect } from 'vitest';
import {
  PERSONALITY_CONFIGS,
  createDefaultAIConfig,
  generateSystemPrompt,
  getRandomGreeting,
  matchesPersonality,
  adjustMessageForPersonality,
  PersonalityConfig,
} from '../utils/personality';
import { PersonalityType } from '../src/lib/database.types';

const ALL_PERSONALITY_TYPES: PersonalityType[] = [
  'friendly',
  'professional',
  'flirty',
  'intellectual',
  'funny',
  'romantic',
  'adventurous',
  'calm',
  'energetic',
  'mysterious',
];

describe('PERSONALITY_CONFIGS', () => {
  it('should have configurations for all personality types', () => {
    ALL_PERSONALITY_TYPES.forEach((type) => {
      expect(PERSONALITY_CONFIGS[type]).toBeDefined();
    });
  });

  it('should have required properties for each configuration', () => {
    Object.values(PERSONALITY_CONFIGS).forEach((config) => {
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('description');
      expect(config).toHaveProperty('emoji');
      expect(config).toHaveProperty('conversationStyle');
      expect(config).toHaveProperty('traits');
      expect(config).toHaveProperty('greetingExamples');
    });
  });

  it('should have valid conversation styles', () => {
    const validStyles = ['casual', 'formal', 'playful'];

    Object.values(PERSONALITY_CONFIGS).forEach((config) => {
      expect(validStyles).toContain(config.conversationStyle);
    });
  });

  it('should have at least one trait for each personality', () => {
    Object.values(PERSONALITY_CONFIGS).forEach((config) => {
      expect(config.traits.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one greeting example for each personality', () => {
    Object.values(PERSONALITY_CONFIGS).forEach((config) => {
      expect(config.greetingExamples.length).toBeGreaterThan(0);
    });
  });

  it('should have emoji icons for all personalities', () => {
    Object.values(PERSONALITY_CONFIGS).forEach((config) => {
      expect(config.emoji).toBeTruthy();
      expect(config.emoji.length).toBeGreaterThan(0);
    });
  });

  describe('specific personality configurations', () => {
    it('should have casual style for friendly personality', () => {
      expect(PERSONALITY_CONFIGS.friendly.conversationStyle).toBe('casual');
    });

    it('should have formal style for professional personality', () => {
      expect(PERSONALITY_CONFIGS.professional.conversationStyle).toBe('formal');
    });

    it('should have playful style for flirty personality', () => {
      expect(PERSONALITY_CONFIGS.flirty.conversationStyle).toBe('playful');
    });

    it('should have formal style for intellectual personality', () => {
      expect(PERSONALITY_CONFIGS.intellectual.conversationStyle).toBe('formal');
    });

    it('should have playful style for energetic personality', () => {
      expect(PERSONALITY_CONFIGS.energetic.conversationStyle).toBe('playful');
    });
  });
});

describe('createDefaultAIConfig', () => {
  it('should create config with correct personality traits', () => {
    const config = createDefaultAIConfig('friendly');

    expect(config.personality_traits).toEqual(PERSONALITY_CONFIGS.friendly.traits);
  });

  it('should create config with correct conversation style', () => {
    const config = createDefaultAIConfig('professional');

    expect(config.conversation_style).toBe('formal');
  });

  it('should default to Czech language when not specified', () => {
    const config = createDefaultAIConfig('friendly');

    expect(config.language_preference).toBe('cs');
  });

  it('should use provided language', () => {
    const config = createDefaultAIConfig('friendly', 'en');

    expect(config.language_preference).toBe('en');
  });

  it('should have lower temperature for intellectual personality', () => {
    const intellectualConfig = createDefaultAIConfig('intellectual');
    const friendlyConfig = createDefaultAIConfig('friendly');

    expect(intellectualConfig.temperature).toBe(0.7);
    expect(friendlyConfig.temperature).toBe(0.8);
  });

  it('should set max_tokens to 150', () => {
    ALL_PERSONALITY_TYPES.forEach((type) => {
      const config = createDefaultAIConfig(type);
      expect(config.max_tokens).toBe(150);
    });
  });

  it('should have null model_endpoint initially', () => {
    const config = createDefaultAIConfig('friendly');

    expect(config.model_endpoint).toBeNull();
  });

  it('should have empty custom_params', () => {
    const config = createDefaultAIConfig('friendly');

    expect(config.custom_params).toEqual({});
  });

  it('should generate system prompt', () => {
    const config = createDefaultAIConfig('friendly', 'cs');

    expect(config.system_prompt).toBeTruthy();
    expect(config.system_prompt.length).toBeGreaterThan(0);
  });
});

describe('generateSystemPrompt', () => {
  it('should include Czech language instruction for cs', () => {
    const prompt = generateSystemPrompt('friendly', 'cs');

    expect(prompt).toContain('Odpovídej v češtině');
  });

  it('should include English language instruction for en', () => {
    const prompt = generateSystemPrompt('friendly', 'en');

    expect(prompt).toContain('Respond in English');
  });

  it('should include personality label', () => {
    const prompt = generateSystemPrompt('friendly', 'cs');

    expect(prompt).toContain(PERSONALITY_CONFIGS.friendly.label);
  });

  it('should include personality traits', () => {
    const prompt = generateSystemPrompt('friendly', 'cs');
    const traits = PERSONALITY_CONFIGS.friendly.traits;

    traits.forEach((trait) => {
      expect(prompt).toContain(trait);
    });
  });

  it('should include conversation style', () => {
    const prompt = generateSystemPrompt('friendly', 'cs');

    expect(prompt).toContain(PERSONALITY_CONFIGS.friendly.conversationStyle);
  });

  it('should include rules/guidelines', () => {
    const prompt = generateSystemPrompt('friendly', 'cs');

    expect(prompt).toContain('Pravidla');
    expect(prompt).toContain('autentická');
    expect(prompt).toContain('emoji');
  });

  it('should generate different prompts for different languages', () => {
    const csPrompt = generateSystemPrompt('friendly', 'cs');
    const enPrompt = generateSystemPrompt('friendly', 'en');

    expect(csPrompt).not.toBe(enPrompt);
  });
});

describe('getRandomGreeting', () => {
  it('should return a string', () => {
    const greeting = getRandomGreeting('friendly');

    expect(typeof greeting).toBe('string');
  });

  it('should return greeting from config', () => {
    const greeting = getRandomGreeting('friendly');
    const validGreetings = PERSONALITY_CONFIGS.friendly.greetingExamples;

    expect(validGreetings).toContain(greeting);
  });

  it('should return greeting for all personality types', () => {
    ALL_PERSONALITY_TYPES.forEach((type) => {
      const greeting = getRandomGreeting(type);
      expect(typeof greeting).toBe('string');
      expect(greeting.length).toBeGreaterThan(0);
    });
  });

  it('should return different greetings over multiple calls (probabilistic)', () => {
    // Call multiple times and collect unique greetings
    const greetings = new Set<string>();
    for (let i = 0; i < 100; i++) {
      greetings.add(getRandomGreeting('friendly'));
    }

    // Should get at least 2 different greetings in 100 tries
    // (with 3 options, probability of all same is (1/3)^99 ≈ 0)
    expect(greetings.size).toBeGreaterThan(1);
  });
});

describe('matchesPersonality', () => {
  describe('energetic personality', () => {
    it('should match text with exclamation marks', () => {
      expect(matchesPersonality('Hello! How are you!', 'energetic')).toBe(true);
    });

    it('should not match calm text without exclamation', () => {
      expect(matchesPersonality('Hello, how are you.', 'energetic')).toBe(false);
    });
  });

  describe('calm personality', () => {
    it('should match text without exclamation marks', () => {
      expect(matchesPersonality('Hello. How are you doing today.', 'calm')).toBe(true);
    });

    it('should not match short text', () => {
      expect(matchesPersonality('Hi.', 'calm')).toBe(false);
    });

    it('should not match text with exclamation marks', () => {
      expect(matchesPersonality('Hello! Great to see you!', 'calm')).toBe(false);
    });
  });

  describe('flirty personality', () => {
    it('should match text with emoji', () => {
      expect(matchesPersonality('Hey there 😊', 'flirty')).toBe(true);
    });

    it('should match text with wink emoji', () => {
      expect(matchesPersonality('Hey 😉', 'flirty')).toBe(true);
    });

    it('should match text with kiss emoji', () => {
      expect(matchesPersonality('Hello 😘', 'flirty')).toBe(true);
    });
  });

  describe('intellectual personality', () => {
    it('should match longer text with questions', () => {
      expect(
        matchesPersonality(
          'What do you think about the philosophical implications of this?',
          'intellectual'
        )
      ).toBe(true);
    });

    it('should not match short text', () => {
      expect(matchesPersonality('What?', 'intellectual')).toBe(false);
    });
  });

  describe('funny personality', () => {
    it('should match text with laughing emoji', () => {
      expect(matchesPersonality('That was hilarious 😂', 'funny')).toBe(true);
    });

    it('should match text with grinning emoji', () => {
      expect(matchesPersonality('Ha! 😄', 'funny')).toBe(true);
    });
  });

  describe('default cases', () => {
    it('should return true for other personalities by default', () => {
      expect(matchesPersonality('Hello', 'friendly')).toBe(true);
      expect(matchesPersonality('Hi there', 'romantic')).toBe(true);
      expect(matchesPersonality('Hey!', 'adventurous')).toBe(true);
    });
  });
});

describe('adjustMessageForPersonality', () => {
  describe('energetic personality', () => {
    it('should replace periods with exclamation marks', () => {
      const result = adjustMessageForPersonality('Hello. How are you.', 'energetic');

      expect(result).toBe('Hello! How are you!');
    });

    it('should not modify text that already has exclamation marks', () => {
      const result = adjustMessageForPersonality('Hello! How are you!', 'energetic');

      expect(result).toBe('Hello! How are you!');
    });
  });

  describe('calm personality', () => {
    it('should replace exclamation marks with periods', () => {
      const result = adjustMessageForPersonality('Hello! How are you!', 'calm');

      expect(result).toBe('Hello. How are you.');
    });

    it('should handle multiple exclamation marks', () => {
      const result = adjustMessageForPersonality('Amazing!!! Wow!!!', 'calm');

      expect(result).toBe('Amazing. Wow.');
    });
  });

  describe('flirty personality', () => {
    it('should add emoji if none present', () => {
      const result = adjustMessageForPersonality('Hey there', 'flirty');

      expect(result).toContain('😊');
    });

    it('should not add emoji if already present', () => {
      const original = 'Hey there 😉';
      const result = adjustMessageForPersonality(original, 'flirty');

      expect(result).toBe(original);
    });
  });

  describe('other personalities', () => {
    it('should not modify message for friendly personality', () => {
      const message = 'Hello, how are you?';
      const result = adjustMessageForPersonality(message, 'friendly');

      expect(result).toBe(message);
    });

    it('should not modify message for professional personality', () => {
      const message = 'Good afternoon.';
      const result = adjustMessageForPersonality(message, 'professional');

      expect(result).toBe(message);
    });
  });
});

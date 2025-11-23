import { describe, it, expect } from 'vitest';
import { parseLocaleParts } from '../utils/locale';

describe('parseLocaleParts', () => {
  describe('Language Parsing', () => {
    it('should parse supported languages correctly', () => {
      expect(parseLocaleParts('en-US').language).toBe('en');
      expect(parseLocaleParts('cs-CZ').language).toBe('cs');
      expect(parseLocaleParts('de-DE').language).toBe('de');
      expect(parseLocaleParts('fr-FR').language).toBe('fr');
      expect(parseLocaleParts('es-ES').language).toBe('es');
      expect(parseLocaleParts('it-IT').language).toBe('it');
      expect(parseLocaleParts('pl-PL').language).toBe('pl');
      expect(parseLocaleParts('pt-PT').language).toBe('pt');
    });

    it('should default to English for unsupported languages', () => {
      expect(parseLocaleParts('ja-JP').language).toBe('en');
      expect(parseLocaleParts('zh-CN').language).toBe('en');
      expect(parseLocaleParts('ru-RU').language).toBe('en');
      expect(parseLocaleParts('ko-KR').language).toBe('en');
    });

    it('should handle case-insensitive language codes', () => {
      expect(parseLocaleParts('EN-US').language).toBe('en');
      expect(parseLocaleParts('CS-CZ').language).toBe('cs');
      expect(parseLocaleParts('De-De').language).toBe('de');
    });
  });

  describe('Country Parsing', () => {
    it('should parse supported countries correctly', () => {
      expect(parseLocaleParts('en-US').country).toBe('US');
      expect(parseLocaleParts('en-GB').country).toBe('GB');
      expect(parseLocaleParts('de-DE').country).toBe('DE');
      expect(parseLocaleParts('fr-FR').country).toBe('FR');
      expect(parseLocaleParts('cs-CZ').country).toBe('CZ');
      expect(parseLocaleParts('pl-PL').country).toBe('PL');
      expect(parseLocaleParts('de-AT').country).toBe('AT');
      expect(parseLocaleParts('de-CH').country).toBe('CH');
    });

    it('should default to US for unsupported countries', () => {
      expect(parseLocaleParts('en-JP').country).toBe('US');
      expect(parseLocaleParts('en-CN').country).toBe('US');
      expect(parseLocaleParts('en-RU').country).toBe('US');
    });

    it('should default to US when country is missing', () => {
      expect(parseLocaleParts('en').country).toBe('US');
      expect(parseLocaleParts('cs').country).toBe('US');
    });

    it('should handle case-insensitive country codes', () => {
      expect(parseLocaleParts('en-us').country).toBe('US');
      expect(parseLocaleParts('cs-cz').country).toBe('CZ');
      expect(parseLocaleParts('de-de').country).toBe('DE');
    });
  });

  describe('Currency Mapping', () => {
    it('should map Czech Republic to CZK', () => {
      expect(parseLocaleParts('cs-CZ').currency).toBe('CZK');
    });

    it('should map Poland to PLN', () => {
      expect(parseLocaleParts('pl-PL').currency).toBe('PLN');
    });

    it('should map Switzerland to CHF', () => {
      expect(parseLocaleParts('de-CH').currency).toBe('CHF');
    });

    it('should map UK to GBP', () => {
      expect(parseLocaleParts('en-GB').currency).toBe('GBP');
    });

    it('should map US to USD', () => {
      expect(parseLocaleParts('en-US').currency).toBe('USD');
    });

    it('should map Eurozone countries to EUR', () => {
      expect(parseLocaleParts('de-DE').currency).toBe('EUR');
      expect(parseLocaleParts('fr-FR').currency).toBe('EUR');
      expect(parseLocaleParts('es-ES').currency).toBe('EUR');
      expect(parseLocaleParts('it-IT').currency).toBe('EUR');
      expect(parseLocaleParts('de-AT').currency).toBe('EUR');
      expect(parseLocaleParts('fr-BE').currency).toBe('EUR');
      expect(parseLocaleParts('nl-NL').currency).toBe('EUR');
      expect(parseLocaleParts('pt-PT').currency).toBe('EUR');
    });

    it('should default to USD for unknown countries', () => {
      expect(parseLocaleParts('en-JP').currency).toBe('USD');
      expect(parseLocaleParts('en').currency).toBe('USD');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string gracefully', () => {
      const result = parseLocaleParts('');
      expect(result.language).toBe('en');
      expect(result.country).toBe('US');
      expect(result.currency).toBe('USD');
    });

    it('should handle malformed locales', () => {
      const result = parseLocaleParts('invalid');
      expect(result.language).toBe('en');
      expect(result.country).toBe('US');
    });

    it('should handle extra dashes in locale', () => {
      // Only first two parts should be used
      const result = parseLocaleParts('en-US-extra');
      expect(result.language).toBe('en');
      expect(result.country).toBe('US');
    });

    it('should return consistent object structure', () => {
      const result = parseLocaleParts('cs-CZ');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('country');
      expect(result).toHaveProperty('currency');
      expect(Object.keys(result)).toHaveLength(3);
    });
  });

  describe('Common Locale Combinations', () => {
    it('should handle common European locales', () => {
      const locales = [
        { input: 'de-DE', expected: { language: 'de', country: 'DE', currency: 'EUR' } },
        { input: 'fr-FR', expected: { language: 'fr', country: 'FR', currency: 'EUR' } },
        { input: 'cs-CZ', expected: { language: 'cs', country: 'CZ', currency: 'CZK' } },
        { input: 'pl-PL', expected: { language: 'pl', country: 'PL', currency: 'PLN' } },
        { input: 'en-GB', expected: { language: 'en', country: 'GB', currency: 'GBP' } },
      ];

      locales.forEach(({ input, expected }) => {
        const result = parseLocaleParts(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle mixed country/language combinations', () => {
      // English speaker in Germany
      const result1 = parseLocaleParts('en-DE');
      expect(result1.language).toBe('en');
      expect(result1.country).toBe('DE');
      expect(result1.currency).toBe('EUR');

      // Czech speaker in Austria
      const result2 = parseLocaleParts('cs-AT');
      expect(result2.language).toBe('cs');
      expect(result2.country).toBe('AT');
      expect(result2.currency).toBe('EUR');
    });
  });
});

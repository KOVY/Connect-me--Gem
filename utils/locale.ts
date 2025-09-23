import { SupportedLanguage, SupportedCountry, SupportedCurrency } from '../types';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'cs'];
const SUPPORTED_COUNTRIES: SupportedCountry[] = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'CZ'];

const getCurrencyFromCountry = (country: SupportedCountry): SupportedCurrency => {
    switch (country) {
        case 'CZ': return 'CZK';
        case 'DE':
        case 'FR':
        case 'ES':
        case 'IT': return 'EUR';
        case 'GB': return 'GBP';
        case 'US':
        default: return 'USD';
    }
};

/**
 * Parses a locale string (e.g., "cs-CZ") into its constituent, validated parts.
 * Provides safe defaults for unsupported languages or countries.
 * @param locale The locale string from the URL.
 * @returns An object with validated language, country, and currency.
 */
export const parseLocaleParts = (locale: string): { language: SupportedLanguage, country: SupportedCountry, currency: SupportedCurrency } => {
    const [langPart, countryPart] = locale.toLowerCase().split('-');

    const language = SUPPORTED_LANGUAGES.includes(langPart as SupportedLanguage)
        ? (langPart as SupportedLanguage)
        : 'en';

    const potentialCountry = countryPart?.toUpperCase();
    const country = SUPPORTED_COUNTRIES.includes(potentialCountry as SupportedCountry)
        ? (potentialCountry as SupportedCountry)
        : 'US'; // Default to 'US' if country is not supported or absent

    const currency = getCurrencyFromCountry(country);

    return { language, country, currency };
};

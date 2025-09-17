import { useLocale } from '../contexts/LocaleContext';
import { translations } from '../translations';

type TranslationKey = keyof typeof translations['en'];

export const useTranslations = () => {
    const { language } = useLocale();

    const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
        let translation = translations[language]?.[key] || translations['en'][key];
        if (replacements) {
            Object.entries(replacements).forEach(([key, value]) => {
                translation = translation.replace(`{${key}}`, String(value));
            });
        }
        return translation;
    };

    return { t };
};

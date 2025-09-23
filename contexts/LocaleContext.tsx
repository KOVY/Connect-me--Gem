import React, { createContext, useContext, useMemo } from 'react';
import { LocaleContextState, SupportedLanguage, SupportedCountry, SupportedCurrency } from '../types';
import { parseLocaleParts } from '../utils/locale';

const LocaleContext = createContext<LocaleContextState | null>(null);

interface LocaleProviderProps {
    children: React.ReactNode;
    locale: string;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, locale }) => {
    const contextValue = useMemo<LocaleContextState>(() => {
        // Normalize the locale to lowercase to ensure consistency throughout the app.
        const normalizedLocale = locale.toLowerCase();
        const { language, country, currency } = parseLocaleParts(normalizedLocale);
        return {
            locale: normalizedLocale,
            language,
            country,
            currency,
        };
    }, [locale]);
    
    return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextState => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

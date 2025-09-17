import React, { createContext, useContext, useMemo } from 'react';
import { LocaleContextState, SupportedLanguage, SupportedCountry, SupportedCurrency } from '../types';

const LocaleContext = createContext<LocaleContextState | null>(null);

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
}

interface LocaleProviderProps {
    children: React.ReactNode;
    locale: string;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, locale }) => {
    const contextValue = useMemo<LocaleContextState>(() => {
        const [langPart, countryPart] = locale.toLowerCase().split('-');
        const language = (['en', 'cs'].includes(langPart) ? langPart : 'en') as SupportedLanguage;
        const country = (countryPart?.toUpperCase() ?? 'US') as SupportedCountry;
        const currency = getCurrencyFromCountry(country);

        return {
            locale,
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

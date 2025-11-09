import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Supported locales with their full locale-country codes
const SUPPORTED_LOCALES = [
    'cs-cz', 'en-us', 'en-gb', 'de-de', 'de-at', 'de-ch',
    'fr-fr', 'es-es', 'it-it', 'pl-pl', 'pt-pt'
];

const DEFAULT_LOCALE = 'cs-cz'; // Default to Czech with CZK currency

const RootRedirect: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // Try to detect user's locale from browser
            const browserLocale = navigator?.language?.toLowerCase() || DEFAULT_LOCALE;

            // Check if detected locale is supported
            const targetLocale = SUPPORTED_LOCALES.includes(browserLocale)
                ? browserLocale
                : DEFAULT_LOCALE;

            navigate(`/${targetLocale}`, { replace: true });
        } catch (error) {
            // Fallback to default if anything fails (e.g., SSR on Vercel)
            navigate(`/${DEFAULT_LOCALE}`, { replace: true });
        }
    }, [navigate]);

    // Render nothing while the redirect is happening.
    return null;
};

export default RootRedirect;

import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { LocaleProvider } from '../contexts/LocaleContext';

const NotFoundContent: React.FC = () => {
    const { t } = useTranslations();

    return (
        <div className="bg-[#120B2E] text-white h-screen w-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold aurora-text">404</h1>
            <p className="text-xl mt-4 text-white/80">{t('page_not_found')}</p>
            <a href="/" className="mt-8 px-6 py-2 rounded-full aurora-gradient font-semibold">
                {t('go_home')}
            </a>
        </div>
    );
}


const NotFoundPage: React.FC = () => {
    const detectedLocale = navigator.language || 'en-US';
    return (
        <LocaleProvider locale={detectedLocale}>
            <NotFoundContent />
        </LocaleProvider>
    );
};

export default NotFoundPage;
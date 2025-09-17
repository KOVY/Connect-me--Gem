import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const LoginPage: React.FC = () => {
    const { t } = useTranslations();
    const { locale } = useLocale();
    return (
        <div className="p-8 flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold aurora-text">{t('login_page')}</h1>
             <Link to={`/${locale}/`} className="mt-8 px-6 py-2 rounded-full aurora-gradient font-semibold">
                 {t('go_home')}
            </Link>
        </div>
    );
};

export default LoginPage;
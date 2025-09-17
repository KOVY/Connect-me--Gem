import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useLocale } from '../contexts/LocaleContext';
import { PROFILES } from '../constants';

const PublicProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { t } = useTranslations();
    const { locale } = useLocale();
    const profile = PROFILES.find(p => p.id === userId);
    
    return (
        <div className="p-8 flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold aurora-text">
                {profile ? t('public_profile_page', { name: profile.name }) : 'User Not Found'}
            </h1>
            <p className="mt-4 text-white/80">This will show the public profile of another user.</p>
            <Link to={`/${locale}/`} className="mt-8 px-6 py-2 rounded-full aurora-gradient font-semibold">
                 {t('go_home')}
            </Link>
        </div>
    );
};

export default PublicProfilePage;
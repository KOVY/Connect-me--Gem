// FIX: Creating the OverviewTab component for the user profile hub.
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useTranslations } from '../../hooks/useTranslations';
import BalanceWidget from '../BalanceWidget';
import ProfileCompletenessWidget from '../ProfileCompletenessWidget';

const OverviewTab: React.FC = () => {
  const { user, isLoading, profileCompleteness, completionSuggestions } = useUser();
  const { locale } = useLocale();
  const { t } = useTranslations();

  if (isLoading && !user) {
    return <div>{t('loading_overview')}</div>;
  }

  if (!user) {
    return <div>{t('could_not_load_user')}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{t('welcome_back_user', { name: user.name })}</h2>
        <p className="mt-1 text-gray-400">{t('hub_quick_look')}</p>
      </div>

      {profileCompleteness < 100 && (
        <ProfileCompletenessWidget 
            completeness={profileCompleteness} 
            suggestions={completionSuggestions}
            showAction={true}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceWidget />
        <div className="p-6 bg-gray-800 rounded-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-white/80">{t('need_more_credits')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('purchase_package_fun')}</p>
            <Link
                to={`/${locale}/profile/me/shop`}
                className="mt-4 px-6 py-2 rounded-full aurora-gradient font-semibold"
            >
                {t('go_to_shop')}
            </Link>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">{t('quick_actions')}</h3>
        <div className="mt-4 flex flex-wrap gap-4">
            <Link to={`/${locale}/profile/me/profile`} className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 font-medium transition-colors">
                {t('edit_my_profile')}
            </Link>
            <Link to={`/${locale}/profile/me/history`} className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 font-medium transition-colors">
                {t('view_history')}
            </Link>
             <Link to={`/${locale}/`} className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-medium transition-colors">
                {t('back_to_discovery')}
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
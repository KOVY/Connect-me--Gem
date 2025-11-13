// FIX: Creating the ProfileHub component.
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';

const TABS = [
  { key: 'profile_hub_overview', path: '' },
  { key: 'profile_hub_my_profile', path: 'profile' },
  { key: 'profile_hub_likes', path: 'likes' },
  { key: 'profile_hub_subscription', path: 'subscription' },
  { key: 'profile_hub_shop', path: 'shop' },
  { key: 'profile_hub_payout', path: 'payout' },
  { key: 'profile_hub_history', path: 'history' },
  { key: 'profile_hub_analytics', path: 'analytics' },
  { key: 'profile_hub_payments', path: 'payments' },
  { key: 'profile_hub_settings', path: 'settings' },
];

const ProfileHub: React.FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslations();
    const location = useLocation();

    // Determine the base path for NavLink 'end' prop
    const baseProfilePath = `/${locale}/profile/me`;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    {TABS.map(tab => (
                         <NavLink
                            key={tab.key}
                            to={tab.path ? `${baseProfilePath}/${tab.path}` : baseProfilePath}
                            // The 'end' prop is crucial for the base path to not stay active for all child routes
                            end={tab.path === ''}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-pink-600 text-white font-semibold'
                                    : 'hover:bg-gray-700'
                                }`
                            }
                        >
                            {t(tab.key)}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="flex-1">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProfileHub;

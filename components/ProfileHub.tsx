// FIX: Creating the ProfileHub component.
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const TABS = [
  { name: 'Overview', path: '' },
  { name: 'My Profile', path: 'profile' },
  { name: 'Likes', path: 'likes' },
  { name: 'Subscription', path: 'subscription' },
  { name: 'Shop', path: 'shop' },
  { name: 'History', path: 'history' },
  { name: 'Analytics', path: 'analytics' },
  { name: 'Payments', path: 'payments' },
  { name: 'Settings', path: 'settings' },
];

const ProfileHub: React.FC = () => {
    const { locale } = useLocale();
    const location = useLocation();

    // Determine the base path for NavLink 'end' prop
    const baseProfilePath = `/${locale}/profile/me`;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                    {TABS.map(tab => (
                         <NavLink
                            key={tab.name}
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
                            {tab.name}
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

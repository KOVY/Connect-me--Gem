import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { LocaleProvider } from '../contexts/LocaleContext';
import { UserProvider } from '../contexts/UserContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { FloatingGlassNav } from './FloatingGlassNav';
import { BottomActionBar } from './BottomActionBar';

const LocaleLayout: React.FC = () => {
    const { locale } = useParams<{ locale: string }>();

    if (!locale) {
        // This case should ideally be handled by the router redirecting from '/',
        // but it's good practice to have a fallback.
        return <div>Loading locale...</div>;
    }

    return (
        <LocaleProvider locale={locale}>
            <UserProvider>
                <NotificationProvider>
                    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white overflow-hidden">
                        {/* Floating Glass Navigation */}
                        <FloatingGlassNav />

                        {/* Main content area with top padding for fixed nav */}
                        <main className="h-full w-full overflow-y-auto">
                            <Outlet />
                        </main>

                        {/* Bottom Action Bar (Mobile Only) */}
                        <BottomActionBar />
                    </div>
                </NotificationProvider>
            </UserProvider>
        </LocaleProvider>
    );
};

export default LocaleLayout;
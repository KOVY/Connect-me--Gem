import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { LocaleProvider } from '../contexts/LocaleContext';
import { UserProvider } from '../contexts/UserContext';
import BottomNavBar from './BottomNavBar';

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
                <div className="h-screen w-screen bg-[#120B2E] text-white flex flex-col">
                    {/* Main content area that fills the available space */}
                    <main className="flex-1 min-h-0">
                        <Outlet />
                    </main>
                    {/* Nav bar is now part of the flex layout, not fixed */}
                    <BottomNavBar />
                </div>
            </UserProvider>
        </LocaleProvider>
    );
};

export default LocaleLayout;
// FIX: Creating the `LocaleLayout` component to provide contexts and render child routes.
import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { LocaleProvider } from '../contexts/LocaleContext';
import { UserProvider } from '../contexts/UserContext';

const LocaleLayout: React.FC = () => {
    const { locale } = useParams<{ locale: string }>();

    // This is a simple validation. A real app would have a more robust system.
    if (!locale || !/^[a-z]{2}(-[a-z]{2})?$/i.test(locale)) {
      // Redirect to a default/detected locale if the URL is malformed
      const detectedLocale = navigator.language || 'en-US';
      return <Navigate to={`/${detectedLocale}`} replace />;
    }

    return (
        <LocaleProvider locale={locale}>
            <UserProvider>
                {/* This div represents the main app container */}
                <div className="h-screen w-screen bg-[#120B2E] text-white font-sans overflow-hidden">
                    <Outlet />
                </div>
            </UserProvider>
        </LocaleProvider>
    );
};

export default LocaleLayout;
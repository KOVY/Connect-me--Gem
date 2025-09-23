import React from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute: React.FC = () => {
    const { isLoggedIn, isLoading } = useUser();
    const location = useLocation();
    const { locale } = useParams<{ locale: string }>();

    if (isLoading) {
        // You can render a loading spinner here
        return <div className="h-screen w-screen flex items-center justify-center"><p>Loading...</p></div>;
    }

    if (!isLoggedIn) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login,
        // which is a nicer user experience than dropping them off on the home page.
        return <Navigate to={`/${locale}/login`} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

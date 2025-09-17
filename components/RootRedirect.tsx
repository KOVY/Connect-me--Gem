import React from 'react';
import { Navigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
    const detectedLocale = navigator.language || 'en-US';
    return <Navigate to={`/${detectedLocale}`} replace />;
};

export default RootRedirect;
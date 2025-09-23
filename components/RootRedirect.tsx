import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const detectedLocale = navigator.language || 'en-US';
        // Force lowercase to prevent issues with case-sensitive checks down the line.
        navigate(`/${detectedLocale.toLowerCase()}`, { replace: true });
    }, [navigate]);

    // Render nothing while the redirect is happening.
    return null;
};

export default RootRedirect;

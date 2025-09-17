// FIX: Creating the BalanceWidget component to display user credit balance.
import React from 'react';
import { useUser } from '../contexts/UserContext';

const BalanceWidget: React.FC = () => {
    const { user, isLoading } = useUser();

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white/80">Your Balance</h3>
            {isLoading && !user ? (
                <div className="mt-2 h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
            ) : (
                <p className="text-3xl font-bold aurora-text mt-2">{user?.credits ?? 0} Credits</p>
            )}
        </div>
    );
};

export default BalanceWidget;

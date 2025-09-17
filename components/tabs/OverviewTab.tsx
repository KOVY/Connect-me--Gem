// FIX: Creating the OverviewTab component for the user profile hub.
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useLocale } from '../../contexts/LocaleContext';
import BalanceWidget from '../BalanceWidget';

const OverviewTab: React.FC = () => {
  const { user, isLoading } = useUser();
  const { locale } = useLocale();

  if (isLoading && !user) {
    return <div>Loading overview...</div>;
  }

  if (!user) {
    return <div>Could not load user data.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
        <p className="mt-1 text-gray-400">Here's a quick look at your hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceWidget />
        <div className="p-6 bg-gray-800 rounded-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-white/80">Need more credits?</h3>
            <p className="text-sm text-gray-400 mt-1">Purchase a package to continue the fun.</p>
            <Link 
                to={`/${locale}/profile/me/shop`} 
                className="mt-4 px-6 py-2 rounded-full aurora-gradient font-semibold"
            >
                Go to Shop
            </Link>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-4">
            <Link to={`/${locale}/profile/me/profile`} className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 font-medium transition-colors">
                Edit My Profile
            </Link>
            <Link to={`/${locale}/profile/me/history`} className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600 font-medium transition-colors">
                View History
            </Link>
             <Link to={`/${locale}/`} className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-medium transition-colors">
                Back to Discovery
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

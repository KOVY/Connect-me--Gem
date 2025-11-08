import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';

const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
    </svg>
);

const StreakWidget: React.FC = () => {
    const { user } = useUser();
    const { locale } = useLocale();
    const navigate = useNavigate();

    if (!user?.stats) {
        return null;
    }

    const streak = user.stats.dailyStreak;
    const isActive = streak.isActive;

    const handleClick = () => {
        navigate(`/${locale}/profile/me/analytics`);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 text-white/70'
            }`}
            title={isActive ? `${streak.current} day streak - Keep it up!` : 'Start your streak today!'}
        >
            <FireIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
            <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-bold">{streak.current}</span>
                <span className="text-[10px] opacity-90">days</span>
            </div>
        </button>
    );
};

export default StreakWidget;

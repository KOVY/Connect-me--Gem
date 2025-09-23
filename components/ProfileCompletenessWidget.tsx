import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface ProfileCompletenessWidgetProps {
    completeness: number;
    suggestions: string[];
    showAction?: boolean;
}

const ProfileCompletenessWidget: React.FC<ProfileCompletenessWidgetProps> = ({ completeness, suggestions, showAction = false }) => {
    const { locale } = useLocale();
    const nextSuggestion = suggestions[0] || "Your profile is complete!";

    return (
        <div className="p-4 bg-gray-900/50 rounded-lg border border-white/10 mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Profile Completeness</h3>
                <span className="font-bold text-lg aurora-text">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="aurora-gradient h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${completeness}%` }}
                ></div>
            </div>
            {completeness < 100 ? (
                <div className="mt-3 text-center">
                    <p className="text-sm text-gray-300">{nextSuggestion}</p>
                    {showAction && (
                        <Link 
                            to={`/${locale}/profile/me/profile`} 
                            className="inline-block mt-3 px-4 py-1.5 text-sm rounded-full bg-pink-600 hover:bg-pink-700 font-semibold transition-colors"
                        >
                            Improve Profile
                        </Link>
                    )}
                </div>
            ) : (
                 <div className="mt-3 text-center">
                    <p className="text-sm text-green-400">{nextSuggestion}</p>
                </div>
            )}
        </div>
    );
};

export default ProfileCompletenessWidget;
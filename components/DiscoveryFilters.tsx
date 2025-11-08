import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { DiscoveryFilters as IDiscoveryFilters } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface DiscoveryFiltersProps {
    filters: IDiscoveryFilters;
    onApply: (filters: IDiscoveryFilters) => void;
    onClose: () => void;
}

const DiscoveryFilters: React.FC<DiscoveryFiltersProps> = ({ filters, onApply, onClose }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [localFilters, setLocalFilters] = useState<IDiscoveryFilters>(filters);

    const hasPremium = user?.subscription &&
        (user.subscription.tier === 'premium' || user.subscription.tier === 'vip') &&
        new Date(user.subscription.expiryDate) > new Date();

    const handleApply = () => {
        if (!hasPremium) {
            navigate(`/${locale}/profile/me/subscription`);
            return;
        }
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        const defaultFilters: IDiscoveryFilters = {
            ageRange: [18, 99],
        };
        setLocalFilters(defaultFilters);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                {/* Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold aurora-text">Discovery Filters</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!hasPremium && (
                    <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg">
                        <p className="text-sm text-white/90">
                            <strong>Premium Feature:</strong> Unlock advanced filters with Premium or VIP subscription
                        </p>
                    </div>
                )}

                {/* Filters */}
                <div className="p-6 space-y-6">
                    {/* Age Range */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">
                            Age Range: {localFilters.ageRange[0]} - {localFilters.ageRange[1]}
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={localFilters.ageRange[0]}
                                    onChange={(e) => setLocalFilters({
                                        ...localFilters,
                                        ageRange: [parseInt(e.target.value), localFilters.ageRange[1]]
                                    })}
                                    className="w-full accent-pink-500"
                                    disabled={!hasPremium}
                                />
                                <div className="text-xs text-white/60 mt-1">Min: {localFilters.ageRange[0]}</div>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="18"
                                    max="99"
                                    value={localFilters.ageRange[1]}
                                    onChange={(e) => setLocalFilters({
                                        ...localFilters,
                                        ageRange: [localFilters.ageRange[0], parseInt(e.target.value)]
                                    })}
                                    className="w-full accent-pink-500"
                                    disabled={!hasPremium}
                                />
                                <div className="text-xs text-white/60 mt-1">Max: {localFilters.ageRange[1]}</div>
                            </div>
                        </div>
                    </div>

                    {/* Distance */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">
                            Distance: {localFilters.distance ? `${localFilters.distance} km` : 'Any'}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={localFilters.distance || 500}
                            onChange={(e) => setLocalFilters({
                                ...localFilters,
                                distance: parseInt(e.target.value)
                            })}
                            className="w-full accent-pink-500"
                            disabled={!hasPremium}
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>1 km</span>
                            <span>500 km</span>
                        </div>
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <div className="font-semibold">Verified Profiles Only</div>
                            <div className="text-sm text-white/60">Show only profiles with verification badge</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.verified || false}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    verified: e.target.checked
                                })}
                                className="sr-only peer"
                                disabled={!hasPremium}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                        </label>
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Education Level</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['high_school', 'bachelors', 'masters', 'phd'] as const).map((level) => {
                                const labels = {
                                    high_school: 'High School',
                                    bachelors: "Bachelor's",
                                    masters: "Master's",
                                    phd: 'PhD'
                                };
                                return (
                                    <label
                                        key={level}
                                        className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                                            localFilters.education?.includes(level)
                                                ? 'bg-pink-500 border-pink-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                        } ${!hasPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localFilters.education?.includes(level) || false}
                                            onChange={(e) => {
                                                const current = localFilters.education || [];
                                                setLocalFilters({
                                                    ...localFilters,
                                                    education: e.target.checked
                                                        ? [...current, level]
                                                        : current.filter(l => l !== level)
                                                });
                                            }}
                                            className="sr-only"
                                            disabled={!hasPremium}
                                        />
                                        <span className="text-sm">{labels[level]}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Lifestyle Filters */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Lifestyle</h3>

                        {/* Smoking */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Smoking</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['never', 'sometimes', 'regularly'] as const).map((pref) => (
                                    <label
                                        key={pref}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer text-center ${
                                            localFilters.smoking?.includes(pref)
                                                ? 'bg-pink-500 border-pink-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                        } ${!hasPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localFilters.smoking?.includes(pref) || false}
                                            onChange={(e) => {
                                                const current = localFilters.smoking || [];
                                                setLocalFilters({
                                                    ...localFilters,
                                                    smoking: e.target.checked
                                                        ? [...current, pref]
                                                        : current.filter(p => p !== pref)
                                                });
                                            }}
                                            className="sr-only"
                                            disabled={!hasPremium}
                                        />
                                        {pref.charAt(0).toUpperCase() + pref.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Drinking */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Drinking</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['never', 'socially', 'regularly'] as const).map((pref) => (
                                    <label
                                        key={pref}
                                        className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer text-center ${
                                            localFilters.drinking?.includes(pref)
                                                ? 'bg-pink-500 border-pink-500'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                        } ${!hasPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localFilters.drinking?.includes(pref) || false}
                                            onChange={(e) => {
                                                const current = localFilters.drinking || [];
                                                setLocalFilters({
                                                    ...localFilters,
                                                    drinking: e.target.checked
                                                        ? [...current, pref]
                                                        : current.filter(p => p !== pref)
                                                });
                                            }}
                                            className="sr-only"
                                            disabled={!hasPremium}
                                        />
                                        {pref.charAt(0).toUpperCase() + pref.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 aurora-gradient rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                        {hasPremium ? 'Apply Filters' : 'Upgrade to Premium'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscoveryFilters;

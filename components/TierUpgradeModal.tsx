import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useTierLimits } from '../hooks/useTierLimits';
import { useUser } from '../contexts/UserContext';

interface TierUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade?: (tier: 'premium' | 'vip') => void;
}

const TIER_PRICES = {
    premium: {
        monthly: 9.99,
        yearly: 99.99, // 2 months free
        currency: 'EUR',
    },
    vip: {
        monthly: 29.99,
        yearly: 299.99, // 2 months free
        currency: 'EUR',
    },
};

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
    const { t } = useTranslations();
    const { user } = useUser();
    const { tierLimits } = useTierLimits(user?.id);
    const [selectedTier, setSelectedTier] = useState<'premium' | 'vip'>('premium');
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const currentTier = tierLimits?.tier || 'anonymous';

    const handleUpgrade = async () => {
        setIsProcessing(true);
        try {
            // Call upgrade handler (will integrate with Stripe)
            if (onUpgrade) {
                await onUpgrade(selectedTier);
            }
            onClose();
        } catch (error) {
            console.error('Upgrade error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getPrice = (tier: 'premium' | 'vip') => {
        const price = billingPeriod === 'monthly'
            ? TIER_PRICES[tier].monthly
            : TIER_PRICES[tier].yearly;
        return price.toFixed(2);
    };

    const getSavings = (tier: 'premium' | 'vip') => {
        const monthlyPrice = TIER_PRICES[tier].monthly;
        const yearlyPrice = TIER_PRICES[tier].yearly;
        const savings = (monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100;
        return Math.round(savings);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 to-pink-900/95 rounded-3xl p-8 shadow-2xl border border-white/10 animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">👑</div>
                    <h2 className="text-4xl font-bold aurora-text mb-3">
                        Upgrade Your Experience
                    </h2>
                    <p className="text-white/70 text-lg">
                        Unlock unlimited features and premium benefits
                    </p>
                    <p className="text-white/50 text-sm mt-2">
                        Current tier: <span className="font-semibold text-purple-300 uppercase">{currentTier}</span>
                    </p>
                </div>

                {/* Billing Period Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/10 rounded-full p-1 flex gap-1">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                billingPeriod === 'monthly'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                                billingPeriod === 'yearly'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                -17%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Premium Card */}
                    <div
                        onClick={() => setSelectedTier('premium')}
                        className={`relative bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                            selectedTier === 'premium'
                                ? 'border-purple-400 scale-105 shadow-2xl'
                                : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                        {selectedTier === 'premium' && (
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}

                        <div className="text-4xl mb-3">💎</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-white">€{getPrice('premium')}</span>
                            <span className="text-white/60 text-sm ml-2">/ {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                        {billingPeriod === 'yearly' && (
                            <div className="mb-4 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm inline-block">
                                Save {getSavings('premium')}% - 2 months free!
                            </div>
                        )}

                        <ul className="space-y-3 text-white/90">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Unlimited messages</strong> - No daily limits</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>No cooldowns</strong> - Chat freely anytime</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>5 Super Likes</strong> daily</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>50% gift fee</strong> on creator earnings</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Ad-free</strong> experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>See who liked you</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Advanced filters</strong></span>
                            </li>
                        </ul>
                    </div>

                    {/* VIP Card */}
                    <div
                        onClick={() => setSelectedTier('vip')}
                        className={`relative bg-gradient-to-br from-yellow-600/50 to-orange-600/50 rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                            selectedTier === 'vip'
                                ? 'border-yellow-400 scale-105 shadow-2xl'
                                : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                        {/* Best Value Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs px-4 py-1 rounded-full shadow-lg">
                            MOST POPULAR
                        </div>

                        {selectedTier === 'vip' && (
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}

                        <div className="text-4xl mb-3">👑</div>
                        <h3 className="text-2xl font-bold text-white mb-2">VIP</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-white">€{getPrice('vip')}</span>
                            <span className="text-white/60 text-sm ml-2">/ {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                        {billingPeriod === 'yearly' && (
                            <div className="mb-4 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm inline-block">
                                Save {getSavings('vip')}% - 2 months free!
                            </div>
                        )}

                        <ul className="space-y-3 text-white/90">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Everything in Premium</strong> +</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>10 Super Likes</strong> daily (2× Premium)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>5 Profile Boosts</strong> per month</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>30% gift fee</strong> - Earn 70% on gifts!</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Priority support</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>VIP badge</strong> on profile</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span><strong>Early access</strong> to new features</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Upgrade Button */}
                <button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="w-full py-5 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-2xl font-bold text-white text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        `Upgrade to ${selectedTier.toUpperCase()} - €${getPrice(selectedTier)}`
                    )}
                </button>

                {/* Money-back guarantee */}
                <div className="mt-6 text-center">
                    <p className="text-white/50 text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/>
                        </svg>
                        Secure payment • Cancel anytime • 30-day money-back guarantee
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TierUpgradeModal;

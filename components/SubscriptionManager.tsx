import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocale } from '../contexts/LocaleContext';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionPlan } from '../types';

const SubscriptionManager: React.FC = () => {
    const { user, subscribe, cancelSubscription, isLoading } = useUser();
    const { currency } = useLocale();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const plansForLocale = SUBSCRIPTION_PLANS.filter(p => p.currency === currency);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setIsProcessing(plan.id);
        try {
            await subscribe(plan.id);
        } catch (error) {
            console.error("Subscription failed", error);
        } finally {
            setIsProcessing(null);
        }
    };

    const handleCancel = async () => {
        setIsProcessing('cancel');
        try {
            await cancelSubscription();
            setShowCancelConfirm(false);
        } catch (error) {
            console.error("Cancellation failed", error);
        } finally {
            setIsProcessing(null);
        }
    };

    const currentTier = user?.subscription?.tier || 'free';
    const isSubscribed = user?.subscription && new Date(user.subscription.expiryDate) > new Date();

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Current Subscription Status */}
            {isSubscribed && user?.subscription && (
                <div className="p-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/30">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold aurora-text capitalize">{currentTier} Member</h3>
                            <p className="text-sm text-white/60 mt-1">Active until {formatDate(user.subscription.expiryDate)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.subscription.autoRenew
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-orange-500/20 text-orange-400'
                        }`}>
                            {user.subscription.autoRenew ? 'Auto-renew ON' : 'Auto-renew OFF'}
                        </div>
                    </div>

                    {/* Subscription Benefits Status */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold aurora-text">
                                {user.superLikesRemaining === 999 ? '∞' : user.superLikesRemaining}
                            </p>
                            <p className="text-xs text-white/60 mt-1">Super Likes</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold aurora-text">{user.boostsRemaining}</p>
                            <p className="text-xs text-white/60 mt-1">Boosts</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                            <p className="text-2xl font-bold aurora-text">
                                {user.rewindsRemaining === 999 ? '∞' : user.rewindsRemaining}
                            </p>
                            <p className="text-xs text-white/60 mt-1">Rewinds</p>
                        </div>
                    </div>

                    {user.subscription.autoRenew && (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            disabled={!!isProcessing}
                            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel Auto-Renewal
                        </button>
                    )}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-white/10">
                        <h3 className="text-xl font-semibold mb-4">Cancel Auto-Renewal?</h3>
                        <p className="text-white/70 mb-6">
                            Your subscription will remain active until {user?.subscription && formatDate(user.subscription.expiryDate)},
                            but it won't renew automatically.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                disabled={!!isProcessing}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                Keep Subscription
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={!!isProcessing}
                                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isProcessing === 'cancel' ? 'Processing...' : 'Cancel Auto-Renewal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Plans */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    {isSubscribed ? 'Upgrade Your Plan' : 'Choose Your Plan'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plansForLocale.map(plan => {
                        const isCurrentPlan = plan.tier === currentTier && isSubscribed;
                        const isBestValue = plan.tier === 'premium';
                        const isVIP = plan.tier === 'vip';

                        return (
                            <div
                                key={plan.id}
                                className={`relative p-6 rounded-lg border-2 transition-all ${
                                    isCurrentPlan
                                        ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500'
                                        : isVIP
                                        ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/50 hover:border-yellow-500'
                                        : 'bg-gray-800 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {/* Badge */}
                                {isBestValue && !isVIP && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold">
                                        BEST VALUE
                                    </div>
                                )}
                                {isVIP && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-xs font-semibold">
                                        VIP
                                    </div>
                                )}
                                {isCurrentPlan && (
                                    <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">
                                        ACTIVE
                                    </div>
                                )}

                                {/* Plan Name & Price */}
                                <div className="text-center mb-4">
                                    <h3 className={`text-2xl font-bold mb-2 ${isVIP ? 'aurora-text' : ''}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        <span className="text-white/60 ml-2">{plan.currency}/month</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-sm">
                                            <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                            <span className="text-white/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Subscribe Button */}
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isLoading || !!isProcessing || isCurrentPlan}
                                    className={`w-full px-4 py-3 rounded-full font-semibold transition-all disabled:opacity-50 ${
                                        isCurrentPlan
                                            ? 'bg-white/10 cursor-not-allowed'
                                            : isVIP
                                            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 aurora-pulse'
                                            : 'aurora-gradient'
                                    }`}
                                >
                                    {isProcessing === plan.id
                                        ? 'Processing...'
                                        : isCurrentPlan
                                        ? 'Current Plan'
                                        : 'Subscribe Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Free Tier Info */}
            {!isSubscribed && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/60 text-center">
                        <strong>Free Plan:</strong> Basic matching, limited likes per day, ads included
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManager;

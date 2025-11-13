import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';
import { useUserReelsAnalytics } from '../hooks/useUserReelsAnalytics';
import { calculatePayoutAmount, MIN_PAYOUT_USD } from '../lib/creditPricing';

const ReelsAnalyticsPanel: React.FC = () => {
    const { user } = useUser();
    const { t } = useTranslations();

    // Real-time analytics subscription
    const { analytics: reelsStats, isLoading } = useUserReelsAnalytics(user?.id);

    // Calculate earnings
    const { userPayoutUsd } = calculatePayoutAmount(reelsStats.totalGiftsValue);
    const canPayout = userPayoutUsd >= MIN_PAYOUT_USD;

    if (isLoading) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-8 border border-white/10 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-white/10 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/3 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (reelsStats.totalReels === 0) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-8 border border-white/10 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-white/60">{t('no_reels_yet')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Content Creator Earnings */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-6 border border-green-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    💰 {t('content_creator_earnings')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">${userPayoutUsd.toFixed(2)}</div>
                        <div className="text-xs text-white/60 mt-1">{t('available_for_payout')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{reelsStats.giftsReceived}</div>
                        <div className="text-xs text-white/60 mt-1">{t('gifts_received')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">{reelsStats.totalGiftsValue}</div>
                        <div className="text-xs text-white/60 mt-1">Total Credits</div>
                    </div>
                </div>
                {!canPayout && (
                    <div className="mt-4 text-center text-xs text-white/50">
                        {t('minimum_payout', { amount: MIN_PAYOUT_USD.toString() })}
                    </div>
                )}
            </div>

            {/* Reels Performance Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    📊 {t('reels_analytics')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{reelsStats.totalReels}</div>
                        <div className="text-xs text-white/60">{t('total_reels_posted')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                            {reelsStats.totalViews > 999 ? `${(reelsStats.totalViews/1000).toFixed(1)}K` : reelsStats.totalViews}
                        </div>
                        <div className="text-xs text-white/60">{t('total_views')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">
                            {reelsStats.totalLikes > 999 ? `${(reelsStats.totalLikes/1000).toFixed(1)}K` : reelsStats.totalLikes}
                        </div>
                        <div className="text-xs text-white/60">{t('total_likes')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                            {reelsStats.totalComments > 999 ? `${(reelsStats.totalComments/1000).toFixed(1)}K` : reelsStats.totalComments}
                        </div>
                        <div className="text-xs text-white/60">{t('total_comments')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReelsAnalyticsPanel;

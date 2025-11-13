import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import GamificationPanel from '../GamificationPanel';
import ReelsAnalyticsPanel from '../ReelsAnalyticsPanel';

const AnalyticsTab: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="space-y-8">
      {/* Reels Analytics Section */}
      <div>
        <h2 className="text-2xl font-bold aurora-text mb-4">{t('reels_analytics')}</h2>
        <ReelsAnalyticsPanel />
      </div>

      {/* Gamification Section */}
      <div>
        <h2 className="text-2xl font-bold aurora-text mb-4">{t('your_progress_achievements')}</h2>
        <GamificationPanel />
      </div>
    </div>
  );
};

export default AnalyticsTab;

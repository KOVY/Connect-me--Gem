import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import GamificationPanel from '../GamificationPanel';

const AnalyticsTab: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold aurora-text mb-4">{t('your_progress_achievements')}</h2>
      <GamificationPanel />
    </div>
  );
};

export default AnalyticsTab;

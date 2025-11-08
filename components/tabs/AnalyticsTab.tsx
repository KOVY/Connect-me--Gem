import React from 'react';
import GamificationPanel from '../GamificationPanel';

const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold aurora-text mb-4">Your Progress & Achievements</h2>
      <GamificationPanel />
    </div>
  );
};

export default AnalyticsTab;

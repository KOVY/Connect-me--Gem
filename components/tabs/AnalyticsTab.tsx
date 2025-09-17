// FIX: Creating the AnalyticsTab component.
import React from 'react';
import StatCard from '../analytics/StatCard';
import ComparisonChart from '../analytics/ComparisonChart';

const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Analytics</h2>
       <p className="text-gray-400">This feature is a work in progress.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Profile Views" value="1,204" change="+12% last week" />
        <StatCard title="Matches" value="87" change="+5% last week" />
        <StatCard title="Gifts Sent" value="12" />
      </div>
      <div>
        <ComparisonChart />
      </div>
    </div>
  );
};

export default AnalyticsTab;

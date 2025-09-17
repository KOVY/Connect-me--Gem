// FIX: Creating the StatCard component.
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h4 className="text-sm text-gray-400">{title}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {change && <p className="text-xs text-green-400 mt-1">{change}</p>}
    </div>
  );
};

export default StatCard;

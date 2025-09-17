// FIX: Creating the ComparisonChart component.
import React from 'react';

const ComparisonChart: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h4 className="font-semibold">Performance Comparison</h4>
      <div className="mt-4 h-48 flex items-center justify-center text-gray-500">
        Chart will be displayed here.
      </div>
    </div>
  );
};

export default ComparisonChart;

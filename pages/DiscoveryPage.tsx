import React, { useState } from 'react';
import DiscoveryFeed from '../components/DiscoveryFeed';
import DiscoveryFilters from '../components/DiscoveryFilters';
import StreakWidget from '../components/StreakWidget';
import { PROFILES } from '../constants';
import { DiscoveryFilters as IDiscoveryFilters } from '../types';

const DiscoveryPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IDiscoveryFilters>({
    ageRange: [18, 99],
  });

  const handleApplyFilters = (newFilters: IDiscoveryFilters) => {
    setFilters(newFilters);
    // TODO: Apply filters to profiles
  };

  return (
    <div className="h-full w-full relative">
      {/* Streak Widget - Top Left */}
      <div className="absolute top-4 left-4 z-30">
        <StreakWidget />
      </div>

      {/* Filter Button - Top Right */}
      <button
        onClick={() => setShowFilters(true)}
        className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all shadow-lg border border-white/20"
        title="Filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      <DiscoveryFeed profiles={PROFILES} />

      {showFilters && (
        <DiscoveryFilters
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default DiscoveryPage;
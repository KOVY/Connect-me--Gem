import React from 'react';
import DiscoveryFeed from '../components/DiscoveryFeed';
import { PROFILES } from '../constants';

const DiscoveryPage: React.FC = () => {
  return (
    <div className="h-full w-full">
      <DiscoveryFeed profiles={PROFILES} />
    </div>
  );
};

export default DiscoveryPage;

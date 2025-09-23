import React from 'react';
import DiscoveryFeed from '../components/DiscoveryFeed';
import { PROFILES } from '../constants';

const DiscoveryPage: React.FC = () => {
  return (
    // h-full makes this component fill its parent <main> container, which is
    // correctly sized by the new flexbox layout in LocaleLayout.
    <div className="h-full w-full">
      <DiscoveryFeed profiles={PROFILES} />
    </div>
  );
};

export default DiscoveryPage;
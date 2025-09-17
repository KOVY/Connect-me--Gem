import React from 'react';
import { UserProfile } from '../types';
import ProfileCard from './ProfileCard';

interface DiscoveryFeedProps {
  profiles: UserProfile[];
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ profiles }) => {
  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {profiles.map((profile) => (
        <div key={profile.id} className="h-full w-full snap-start flex-shrink-0">
          <ProfileCard profile={profile} />
        </div>
      ))}
    </div>
  );
};

export default DiscoveryFeed;
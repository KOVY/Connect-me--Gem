import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import ProfileCard from './ProfileCard';

interface DiscoveryFeedProps {
  profiles: UserProfile[];
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({ profiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartY = useRef(0);

  const handleNextProfile = () => {
    if (isAnimating || currentIndex >= profiles.length - 1) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 500); // Animation duration
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY.current - touchEndY > 50) { // Swiped up
      handleNextProfile();
    }
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = currentIndex < profiles.length - 1 ? profiles[currentIndex + 1] : null;

  return (
    <div
      className="h-full w-full relative overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentProfile ? (
        <>
          {nextProfile && (
            <div className={`absolute inset-0 transition-all duration-500 ease-out ${isAnimating ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-50 z-0'}`}>
              <ProfileCard profile={nextProfile} />
            </div>
          )}
          <div className={`absolute inset-0 z-20 ${isAnimating ? 'animate-card-exit' : ''}`}>
            <ProfileCard profile={currentProfile} onLike={handleNextProfile} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-center">
            <div>
                <h2 className="text-2xl font-bold aurora-text">That's everyone for now!</h2>
                <p className="text-white/70 mt-2">Check back later for new profiles.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
import React, { useState, useMemo } from 'react';
import DiscoveryFeed from '../components/DiscoveryFeed';
import DiscoveryFilters from '../components/DiscoveryFilters';
import StreakWidget from '../components/StreakWidget';
import StoriesBar from '../components/StoriesBar';
import StoryViewer from '../components/StoryViewer';
import AuthPromptModal from '../components/AuthPromptModal';
import { USER_STORIES } from '../constants';
import { DiscoveryFilters as IDiscoveryFilters, UserStories, UserProfile } from '../types';
import { useDiscoveryProfiles } from '../hooks/useDiscoveryProfiles';
import { useSwipeTracker } from '../hooks/useSwipeTracker';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';

const DiscoveryPage: React.FC = () => {
  const { language } = useLocale();
  const { isLoggedIn } = useUser();
  const { profiles, loading, error } = useDiscoveryProfiles(language);
  const swipeTracker = useSwipeTracker(isLoggedIn);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IDiscoveryFilters>({
    ageRange: [18, 99],
  });
  const [selectedStory, setSelectedStory] = useState<UserStories | null>(null);
  const [currentStoryUserIndex, setCurrentStoryUserIndex] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleApplyFilters = (newFilters: IDiscoveryFilters) => {
    setFilters(newFilters);
    // Filters are now applied via filteredProfiles useMemo below
  };

  const handleSwipe = () => {
    swipeTracker.incrementSwipe();

    // Zobrazit modal po dosažení limitu
    if (swipeTracker.hasReachedLimit) {
      setShowAuthPrompt(true);
    }
  };

  const handleStoryClick = (userStories: UserStories) => {
    const index = USER_STORIES.findIndex(us => us.user.id === userStories.user.id);
    setCurrentStoryUserIndex(index);
    setSelectedStory(userStories);
  };

  const handleNextStoryUser = () => {
    if (currentStoryUserIndex < USER_STORIES.length - 1) {
      const nextIndex = currentStoryUserIndex + 1;
      setCurrentStoryUserIndex(nextIndex);
      setSelectedStory(USER_STORIES[nextIndex]);
    } else {
      setSelectedStory(null);
    }
  };

  const handlePreviousStoryUser = () => {
    if (currentStoryUserIndex > 0) {
      const prevIndex = currentStoryUserIndex - 1;
      setCurrentStoryUserIndex(prevIndex);
      setSelectedStory(USER_STORIES[prevIndex]);
    }
  };

  // Apply filters to profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile: UserProfile) => {
      // Age range filter
      if (filters.ageRange) {
        const [minAge, maxAge] = filters.ageRange;
        if (profile.age < minAge || profile.age > maxAge) {
          return false;
        }
      }

      // Verified filter
      if (filters.verified && !profile.verified) {
        return false;
      }

      // Interests filter (at least one matching interest)
      if (filters.interests && filters.interests.length > 0) {
        const hasMatchingInterest = filters.interests.some(
          interest => profile.interests?.includes(interest)
        );
        if (!hasMatchingInterest) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, filters]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top spacing for FloatingGlassNav to prevent overlap */}
      <div className="h-16"></div>

      {/* Stories Bar */}
      <StoriesBar stories={USER_STORIES} onStoryClick={handleStoryClick} />

      {/* Main Content */}
      <div className="flex-1 relative">
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

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/70">Loading profiles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center px-6">
            <div>
              <h2 className="text-2xl font-bold aurora-text mb-2">Oops!</h2>
              <p className="text-white/70">Could not load profiles. Please check your connection.</p>
              <p className="text-white/50 text-sm mt-2">{error.message}</p>
            </div>
          </div>
        ) : (
          <DiscoveryFeed
            profiles={filteredProfiles}
            onSwipe={handleSwipe}
            canSwipe={swipeTracker.canSwipe}
          />
        )}

        {showFilters && (
          <DiscoveryFilters
            filters={filters}
            onApply={handleApplyFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Auth Prompt Modal */}
        <AuthPromptModal
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          swipeCount={swipeTracker.swipeCount}
        />
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          userStories={selectedStory}
          allStories={USER_STORIES}
          onClose={() => setSelectedStory(null)}
          onNext={handleNextStoryUser}
          onPrevious={handlePreviousStoryUser}
        />
      )}
    </div>
  );
};

export default DiscoveryPage;
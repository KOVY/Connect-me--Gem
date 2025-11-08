import React from 'react';
import { UserStories } from '../types';

interface StoriesBarProps {
    stories: UserStories[];
    onStoryClick: (userStories: UserStories) => void;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onStoryClick }) => {
    // Filter out expired stories
    const activeStories = stories.map(userStory => ({
        ...userStory,
        stories: userStory.stories.filter(story => new Date(story.expiresAt) > new Date())
    })).filter(userStory => userStory.stories.length > 0);

    return (
        <div className="w-full bg-black/30 backdrop-blur-md py-3 px-4 border-b border-white/10">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {/* Add Story Button */}
                <button
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                    onClick={() => {
                        // TODO: Implement story creation
                        alert('Story creation coming soon!');
                    }}
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600 group-hover:border-pink-500 transition-colors">
                            <PlusIcon />
                        </div>
                    </div>
                    <span className="text-xs text-white/80 font-medium">Your Story</span>
                </button>

                {/* Story Circles */}
                {activeStories.map((userStory) => {
                    const hasUnviewed = userStory.hasUnviewedStories;

                    return (
                        <button
                            key={userStory.user.id}
                            onClick={() => onStoryClick(userStory)}
                            className="flex flex-col items-center gap-2 min-w-[70px] group"
                        >
                            <div className="relative">
                                {/* Gradient ring for unviewed stories, gray for viewed */}
                                <div className={`absolute inset-0 rounded-full p-[2px] ${
                                    hasUnviewed
                                        ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                                        : 'bg-gray-600'
                                }`}>
                                    <div className="w-full h-full rounded-full bg-[#120B2E] p-[2px]">
                                        <img
                                            src={userStory.user.imageUrl}
                                            alt={userStory.user.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-full" /> {/* Spacer */}

                                {/* Story count badge */}
                                {userStory.stories.length > 1 && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#120B2E]">
                                        {userStory.stories.length}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-white/80 font-medium truncate w-full text-center">
                                {userStory.user.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StoriesBar;

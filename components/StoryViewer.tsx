import React, { useState, useEffect, useCallback } from 'react';
import { UserStories, StoryItem } from '../types';

interface StoryViewerProps {
    userStories: UserStories;
    allStories: UserStories[];
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
);

const StoryViewer: React.FC<StoryViewerProps> = ({
    userStories,
    allStories,
    onClose,
    onNext,
    onPrevious
}) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const currentStory = userStories.stories[currentStoryIndex];
    const storyDuration = 5000; // 5 seconds per story

    // Auto-advance to next story
    useEffect(() => {
        if (isPaused) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = (elapsed / storyDuration) * 100;

            if (newProgress >= 100) {
                handleNextStory();
            } else {
                setProgress(newProgress);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentStoryIndex, isPaused]);

    const handleNextStory = useCallback(() => {
        if (currentStoryIndex < userStories.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else if (onNext) {
            onNext();
        } else {
            onClose();
        }
    }, [currentStoryIndex, userStories.stories.length, onNext, onClose]);

    const handlePreviousStory = useCallback(() => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        } else if (onPrevious) {
            onPrevious();
        }
    }, [currentStoryIndex, onPrevious]);

    const handlePause = () => setIsPaused(true);
    const handleResume = () => setIsPaused(false);

    // Calculate time ago
    const getTimeAgo = (timestamp: string) => {
        const now = Date.now();
        const then = new Date(timestamp).getTime();
        const diff = now - then;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        }
        return `${hours}h ago`;
    };

    return (
        <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
        >
            {/* Background Image */}
            <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Gradient Overlays */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                {userStories.stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100"
                            style={{
                                width: index < currentStoryIndex
                                    ? '100%'
                                    : index === currentStoryIndex
                                        ? `${progress}%`
                                        : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={userStories.user.imageUrl}
                        alt={userStories.user.name}
                        className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div>
                        <div className="text-white font-semibold">{userStories.user.name}</div>
                        <div className="text-white/70 text-xs">{getTimeAgo(currentStory.timestamp)}</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                    <XIcon />
                </button>
            </div>

            {/* Navigation Areas - Left/Right tap zones */}
            <button
                onClick={handlePreviousStory}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                aria-label="Previous story"
            />
            <button
                onClick={handleNextStory}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                aria-label="Next story"
            />

            {/* Caption */}
            {currentStory.caption && (
                <div className="absolute bottom-20 left-4 right-4 z-20">
                    <p className="text-white text-lg font-medium drop-shadow-lg">
                        {currentStory.caption}
                    </p>
                </div>
            )}

            {/* Reaction Button */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-4">
                <button
                    onClick={() => {
                        // TODO: Implement reaction
                        alert('Reaction sent! ❤️');
                    }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                    <HeartIcon />
                    <span className="text-white font-semibold">Send Reaction</span>
                </button>
            </div>
        </div>
    );
};

export default StoryViewer;

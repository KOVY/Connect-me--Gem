import React, { useRef, useEffect, useState } from 'react';
import { Reel } from '../types';
import { GiftModal } from './GiftModal';
import { ReelCommentsPanel } from './ReelCommentsPanel';

interface ReelPlayerProps {
    reel: Reel;
    isVisible: boolean;
}

const PlayOverlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white/50">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);


const ReelPlayer: React.FC<ReelPlayerProps> = ({ reel, isVisible }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    const [isLiked, setIsLiked] = useState(reel.isLiked || false);
    const [likeCount, setLikeCount] = useState(reel.likeCount || 0);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isVisible) {
                videoElement.play().then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.error("Video play failed:", error);
                    setIsPlaying(false);
                });
            } else {
                videoElement.pause();
                videoElement.currentTime = 0; // Reset video on scroll away
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    const togglePlay = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                setIsPlaying(true);
            } else {
                videoElement.pause();
                setIsPlaying(false);
                setShowPlayIcon(true);
                setTimeout(() => setShowPlayIcon(false), 500); // Hide icon after a moment
            }
        }
    };

    return (
        <>
            <div className="relative h-full w-full" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={reel.videoUrl}
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none" style={{ opacity: showPlayIcon ? 1 : 0 }}>
                    <PlayOverlayIcon />
                </div>

                {/* Right Side Action Buttons */}
                <div className="absolute right-4 bottom-24 flex flex-col gap-6 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Like Button */}
                    <button
                        onClick={() => {
                            setIsLiked(!isLiked);
                            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
                        }}
                        className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
                    >
                        <div className={`w-12 h-12 rounded-full ${isLiked ? 'bg-pink-500' : 'bg-white/20 backdrop-blur-sm'} flex items-center justify-center transition-all ${isLiked ? 'animate-bounce-once' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isLiked ? 'white' : 'currentColor'} className="w-7 h-7 text-white">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-medium drop-shadow-lg">
                            {likeCount > 0 ? (likeCount > 999 ? `${(likeCount/1000).toFixed(1)}K` : likeCount) : 'Like'}
                        </span>
                    </button>

                    {/* Comments Button */}
                    <button
                        onClick={() => setIsCommentsOpen(true)}
                        className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-medium drop-shadow-lg">
                            {reel.commentCount && reel.commentCount > 0 ? (reel.commentCount > 999 ? `${(reel.commentCount/1000).toFixed(1)}K` : reel.commentCount) : 'Comment'}
                        </span>
                    </button>

                    {/* Gift Button */}
                    <button
                        onClick={() => setIsGiftModalOpen(true)}
                        className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
                                <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-medium drop-shadow-lg">
                            {reel.giftCount && reel.giftCount > 0 ? reel.giftCount : 'Gift'}
                        </span>
                    </button>
                </div>

                {/* Bottom Info - Fixed for mobile visibility */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 md:pb-4 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={reel.userProfile.imageUrl} alt={reel.userProfile.name} className="w-10 h-10 rounded-full border-2 border-white" />
                        <p className="font-bold drop-shadow-lg">{reel.userProfile.name}</p>
                    </div>
                    <p className="text-sm leading-relaxed drop-shadow-lg max-w-[calc(100%-80px)]">{reel.description}</p>
                </div>
            </div>

            {/* Gift Modal */}
            <GiftModal
                isOpen={isGiftModalOpen}
                onClose={() => setIsGiftModalOpen(false)}
                recipientId={reel.userProfile.id}
                recipientName={reel.userProfile.name}
            />

            {/* Comments Panel */}
            <ReelCommentsPanel
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                reelId={reel.id}
                reelOwner={reel.userProfile}
                commentCount={reel.commentCount || 0}
            />
        </>
    );
};

export default ReelPlayer;
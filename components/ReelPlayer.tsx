import React, { useRef, useEffect, useState } from 'react';
import { Reel } from '../types';

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

            <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
                <div className="flex items-center gap-3">
                    <img src={reel.userProfile.imageUrl} alt={reel.userProfile.name} className="w-10 h-10 rounded-full border-2 border-white" />
                    <p className="font-bold">{reel.userProfile.name}</p>
                </div>
                <p className="mt-2 text-sm">{reel.description}</p>
            </div>
        </div>
    );
};

export default ReelPlayer;
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Reel } from '../types';
import ReelPlayer from './ReelPlayer';

interface ReelsFeedProps {
    reels: Reel[];
}

const ReelsFeed: React.FC<ReelsFeedProps> = ({ reels }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleReelId, setVisibleReelId] = useState<string | null>(reels.length > 0 ? reels[0].id : null);

    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setVisibleReelId(entry.target.getAttribute('data-reel-id'));
            }
        });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: containerRef.current,
            threshold: 0.6, // Reel is considered "visible" when 60% is in view
        });

        const currentContainer = containerRef.current;
        if (currentContainer) {
            Array.from(currentContainer.children).forEach(child => {
                observer.observe(child as Element);
            });
        }

        return () => {
            if (currentContainer) {
                Array.from(currentContainer.children).forEach(child => {
                    observer.unobserve(child as Element);
                });
            }
        };
    }, [reels, observerCallback]);


    if (!reels || reels.length === 0) {
        return <div className="h-full w-full flex items-center justify-center text-white">No reels to show.</div>;
    }

    return (
        <div 
            ref={containerRef}
            className="h-full w-full overflow-y-auto snap-y snap-mandatory"
        >
            {reels.map((reel) => (
                <div 
                    key={reel.id} 
                    data-reel-id={reel.id}
                    className="h-full w-full snap-start relative flex items-center justify-center"
                >
                    <ReelPlayer reel={reel} isVisible={visibleReelId === reel.id} />
                </div>
            ))}
        </div>
    );
};

export default ReelsFeed;
import React from 'react';
import ReelsFeed from '../components/ReelsFeed';
import { REELS } from '../constants';

const ReelsPage: React.FC = () => {
    return (
        <div className="h-full w-full bg-black">
            <ReelsFeed reels={REELS} />
        </div>
    );
};

export default ReelsPage;
import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ProfileLike } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const LikesGallery: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [filter, setFilter] = useState<'all' | 'superLikes' | 'matches'>('all');

    const hasAccess = user?.subscription &&
        (user.subscription.tier === 'basic' || user.subscription.tier === 'premium' || user.subscription.tier === 'vip') &&
        new Date(user.subscription.expiryDate) > new Date();

    if (!user) {
        return (
            <div className="text-center py-10">
                <p className="text-white/70">Loading...</p>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 rounded-lg border border-purple-500/30 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold aurora-text mb-4">See Who Likes You</h2>
                    <p className="text-white/80 mb-6 text-lg">
                        Unlock the ability to see who's already interested! Upgrade to Premium to view everyone who liked your profile.
                    </p>
                    <div className="bg-white/5 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold mb-3">Premium Benefits:</h3>
                        <ul className="text-sm text-white/70 space-y-2 text-left">
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                <span>See who liked you - instant matches!</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                <span>Priority in their discovery feed</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                <span>Super Likes to stand out</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2 mt-0.5">✓</span>
                                <span>Read receipts & more premium features</span>
                            </li>
                        </ul>
                    </div>
                    <button
                        onClick={() => navigate(`/${locale}/profile/me/subscription`)}
                        className="px-8 py-4 aurora-gradient rounded-full font-semibold text-lg hover:scale-105 transition-transform"
                    >
                        Upgrade to Premium
                    </button>
                    <p className="text-sm text-white/50 mt-4">
                        {user.likedBy?.length || 0} {(user.likedBy?.length || 0) === 1 ? 'person has' : 'people have'} liked you
                    </p>
                </div>
            </div>
        );
    }

    const likes = user.likedBy || [];
    const filteredLikes = likes.filter(like => {
        if (filter === 'superLikes') return like.isSuperLike;
        if (filter === 'matches') return like.isMatch;
        return true;
    });

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold aurora-text">People Who Like You</h2>
                <div className="bg-white/10 rounded-full px-4 py-2 text-sm font-semibold">
                    {filteredLikes.length} {filteredLikes.length === 1 ? 'Like' : 'Likes'}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        filter === 'all'
                            ? 'border-b-2 border-pink-500 text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    All ({likes.length})
                </button>
                <button
                    onClick={() => setFilter('superLikes')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        filter === 'superLikes'
                            ? 'border-b-2 border-pink-500 text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    Super Likes ({likes.filter(l => l.isSuperLike).length})
                </button>
                <button
                    onClick={() => setFilter('matches')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        filter === 'matches'
                            ? 'border-b-2 border-pink-500 text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    Matches ({likes.filter(l => l.isMatch).length})
                </button>
            </div>

            {/* Likes Grid */}
            {filteredLikes.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white/40">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </div>
                    <p className="text-xl text-white/60">No {filter !== 'all' ? filter : 'likes'} yet</p>
                    <p className="text-white/40 mt-2">Keep swiping! Your perfect match is out there.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredLikes.map((like) => (
                        <div
                            key={like.profileId}
                            onClick={() => navigate(`/${locale}/profile/${like.profileId}`)}
                            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 aspect-[3/4] hover:scale-105 transition-transform"
                        >
                            {/* Profile Image */}
                            <img
                                src={like.profile.imageUrl}
                                alt={like.profile.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Super Like Badge */}
                            {like.isSuperLike && (
                                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Match Badge */}
                            {like.isMatch && (
                                <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 rounded-full text-xs font-bold">
                                    MATCH
                                </div>
                            )}

                            {/* Profile Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-bold text-lg">
                                    {like.profile.name}, {like.profile.age}
                                </h3>
                                <p className="text-white/80 text-sm">{like.profile.occupation}</p>
                                <p className="text-white/60 text-xs mt-1">{formatTimeAgo(like.timestamp)}</p>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/20 transition-colors"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikesGallery;

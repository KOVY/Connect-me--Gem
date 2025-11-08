import React, { useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
    </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
    </svg>
);

const GamificationPanel: React.FC = () => {
    const { user } = useUser();

    // Calculate user level from points (100 points per level)
    const pointsPerLevel = 100;
    const currentLevel = user?.stats?.level || 1;
    const currentPoints = user?.stats?.points || 0;
    const pointsInCurrentLevel = currentPoints % pointsPerLevel;
    const progressPercentage = (pointsInCurrentLevel / pointsPerLevel) * 100;

    // Merge achievements with user progress
    const achievementsWithProgress = useMemo(() => {
        const userAchievements = user?.stats?.achievements || [];

        return ACHIEVEMENTS.map(achievement => {
            const userAchievement = userAchievements.find(a => a.id === achievement.id);

            if (userAchievement) {
                return { ...achievement, ...userAchievement };
            }

            // Calculate progress based on user stats
            let progress = 0;
            const stats = user?.stats;

            if (stats) {
                switch (achievement.id) {
                    case 'streak_3':
                    case 'streak_7':
                    case 'streak_30':
                    case 'streak_100':
                        progress = Math.min((stats.dailyStreak.current / (achievement.target || 1)) * 100, 100);
                        break;
                    case 'matches_10':
                    case 'matches_50':
                    case 'matches_100':
                        progress = Math.min((stats.totalMatches / (achievement.target || 1)) * 100, 100);
                        break;
                    case 'messages_100':
                    case 'messages_500':
                        progress = Math.min((stats.totalMessages / (achievement.target || 1)) * 100, 100);
                        break;
                    case 'likes_50':
                        progress = Math.min((stats.totalLikes / (achievement.target || 1)) * 100, 100);
                        break;
                    default:
                        progress = 0;
                }
            }

            return { ...achievement, progress };
        });
    }, [user]);

    const unlockedAchievements = achievementsWithProgress.filter(a => a.unlockedAt);
    const lockedAchievements = achievementsWithProgress.filter(a => !a.unlockedAt);

    if (!user?.stats) {
        return (
            <div className="p-8 text-center text-white/60">
                <p>Gamification stats not available. Log in to track your progress!</p>
            </div>
        );
    }

    const stats = user.stats;

    return (
        <div className="space-y-6">
            {/* Level & Points Section */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            Level {currentLevel}
                        </h2>
                        <p className="text-white/70 text-sm">{currentPoints} total points earned</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{pointsInCurrentLevel}</div>
                        <div className="text-sm text-white/60">/ {pointsPerLevel} XP</div>
                    </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-xs text-white/60 mt-2">
                    {pointsPerLevel - pointsInCurrentLevel} XP to next level
                </p>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 mb-2">Daily Login Streak</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-orange-400">🔥</span>
                        <span className="text-3xl font-bold text-white">{stats.dailyStreak.current}</span>
                        <span className="text-white/60">days</span>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                        Longest: {stats.dailyStreak.longest} days
                    </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 mb-2">Message Streak</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">💬</span>
                        <span className="text-3xl font-bold text-white">{stats.messageStreak.current}</span>
                        <span className="text-white/60">days</span>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                        Longest: {stats.messageStreak.longest} days
                    </p>
                </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Activity Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">{stats.totalMatches}</div>
                        <div className="text-xs text-white/60">Matches</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{stats.totalLikes}</div>
                        <div className="text-xs text-white/60">Likes Given</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.totalMessages}</div>
                        <div className="text-xs text-white/60">Messages Sent</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.profileViews}</div>
                        <div className="text-xs text-white/60">Profile Views</div>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrophyIcon className="w-6 h-6 text-yellow-400" />
                        Achievements
                    </h3>
                    <span className="text-sm text-white/60">
                        {unlockedAchievements.length} / {ACHIEVEMENTS.length}
                    </span>
                </div>

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-white/70 mb-3">Unlocked</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {unlockedAchievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-3 border border-yellow-500/30 text-center group hover:scale-105 transition-transform"
                                >
                                    <div className="text-3xl mb-1">{achievement.icon}</div>
                                    <div className="text-xs font-semibold text-white">{achievement.name}</div>
                                    <div className="text-[10px] text-white/60 mt-1 line-clamp-2">
                                        {achievement.description}
                                    </div>
                                    {achievement.unlockedAt && (
                                        <div className="text-[9px] text-yellow-400 mt-1">
                                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-white/70 mb-3">In Progress</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {lockedAchievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="bg-gray-900/50 rounded-lg p-3 border border-white/10 text-center relative group hover:border-white/20 transition-colors"
                                >
                                    <div className="text-3xl mb-1 opacity-40 relative">
                                        {achievement.icon}
                                        <LockIcon className="w-4 h-4 absolute top-0 right-0 text-white/60" />
                                    </div>
                                    <div className="text-xs font-semibold text-white/70">{achievement.name}</div>
                                    <div className="text-[10px] text-white/50 mt-1 line-clamp-2">
                                        {achievement.description}
                                    </div>
                                    {achievement.progress !== undefined && achievement.progress > 0 && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                    style={{ width: `${achievement.progress}%` }}
                                                />
                                            </div>
                                            <div className="text-[9px] text-white/50 mt-1">
                                                {Math.round(achievement.progress)}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamificationPanel;

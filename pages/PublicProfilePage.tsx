import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useLocale } from '../contexts/LocaleContext';
import { PROFILES } from '../constants';

const PublicProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { t } = useTranslations();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const profile = PROFILES.find(p => p.id === userId);

    if (!profile) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold aurora-text">User Not Found</h1>
                <p className="mt-4 text-white/80">{t('user_not_found')}</p>
                <Link to={`/${locale}/`} className="mt-8 px-6 py-2 rounded-full aurora-gradient font-semibold">
                    {t('go_home')}
                </Link>
            </div>
        );
    }

    const handleChatClick = () => {
        navigate(`/${locale}/chat/${profile.id}`);
    };

    const allTags = [...profile.interests, ...profile.hobbies];

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-black/20 to-black/40">
            {/* Profile Header with Background */}
            <div className="relative h-96 w-full">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${profile.imageUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
                </div>

                {/* Back Button */}
                <Link
                    to={`/${locale}/`}
                    className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                    aria-label={t('go_back')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                    </svg>
                </Link>

                {/* Profile Image and Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">{profile.name}, {profile.age}</h1>
                        {profile.verified && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-400">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.579.055 1.14.16 1.68.321A2.25 2.25 0 0 1 17.5 6.5v6.25a2.25 2.25 0 0 1-1.82 2.229c-.538.16-1.1.266-1.68.321v.441A2.75 2.75 0 0 1 11.25 19h-2.5A2.75 2.75 0 0 1 6 16.25v-.443a9.003 9.003 0 0 1-1.68-.321A2.25 2.25 0 0 1 2.5 13.25V6.5a2.25 2.25 0 0 1 1.82-2.23c.538-.16 1.1-.266 1.68-.321V3.75ZM8.5 7.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg>
                            <span>{profile.occupation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="m9.69 18.933.003.001a9.7 9.7 0 0 1-1.38-1.92 9.7 9.7 0 0 1-1.12-2.31A9.7 9.7 0 0 1 6 12.31V9.75a.75.75 0 0 1 1.5 0v2.56c0 .597.107 1.18.315 1.74a8.2 8.2 0 0 0 .84 1.94l.003.001a.75.75 0 0 1-1.03.805ZM10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM8.5 9a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                            </svg>
                            <span>{profile.country}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleChatClick}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                        </svg>
                        {t('chat')}
                    </button>
                    <button
                        className="px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
                        aria-label={t('like')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-400">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.16-1.23c-1.273-1.05-2.267-2.182-2.922-3.29a8.384 8.384 0 0 1-.942-3.805c0-2.812 2.03-5.068 5.197-5.068 1.54 0 2.91.596 3.872 1.566a3.872 3.872 0 0 1 3.872-1.566c3.167 0 5.197 2.256 5.197 5.068 0 1.558-.33 2.942-.942 3.805-1.423 2.226-3.8 4.22-6.082 5.518a15.247 15.247 0 0 1-1.383.597l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006l-.004-.001Z" />
                        </svg>
                    </button>
                </div>

                {/* Bio */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-3">{t('about')}</h2>
                    <p className="text-white/80 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Interests & Hobbies */}
                {allTags.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-3">{t('interests')}</h2>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/70">
                                        <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v3.882a1.5 1.5 0 0 0 .44 1.06l7.25 7.25a.75.75 0 0 0 1.06 0l4.94-4.94a.75.75 0 0 0 0-1.06l-7.25-7.25A1.5 1.5 0 0 0 7.382 2H3.5ZM6.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                    </svg>
                                    <span>{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Icebreakers */}
                {profile.icebreakers && profile.icebreakers.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink-400">
                                <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-xl font-bold">{t('start_conversation')}</h2>
                        </div>
                        <div className="space-y-2">
                            {profile.icebreakers.map((icebreaker, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(`/${locale}/chat/${profile.id}?message=${encodeURIComponent(icebreaker)}`)}
                                    className="w-full text-left px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-sm hover:bg-white/10 hover:border-pink-400/50 transition-all duration-200 group"
                                >
                                    <span className="group-hover:text-pink-300 transition-colors">"{icebreaker}"</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfilePage;
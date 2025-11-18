import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';
import { UserProfile } from '../types';

interface ProfileCardProps {
  profile: UserProfile;
  onLike?: () => void;
}

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.16-1.23c-1.273-1.05-2.267-2.182-2.922-3.29a8.384 8.384 0 0 1-.942-3.805c0-2.812 2.03-5.068 5.197-5.068 1.54 0 2.91.596 3.872 1.566a3.872 3.872 0 0 1 3.872-1.566c3.167 0 5.197 2.256 5.197 5.068 0 1.558-.33 2.942-.942 3.805-1.423 2.226-3.8 4.22-6.082 5.518a15.247 15.247 0 0 1-1.383.597l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006l-.004-.001Z" />
    </svg>
);

const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.579.055 1.14.16 1.68.321A2.25 2.25 0 0 1 17.5 6.5v6.25a2.25 2.25 0 0 1-1.82 2.229c-.538.16-1.1.266-1.68.321v.441A2.75 2.75 0 0 1 11.25 19h-2.5A2.75 2.75 0 0 1 6 16.25v-.443a9.003 9.003 0 0 1-1.68-.321A2.25 2.25 0 0 1 2.5 13.25V6.5a2.25 2.25 0 0 1 1.82-2.23c.538-.16 1.1-.266 1.68-.321V3.75ZM8.5 7.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
);

const TagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v3.882a1.5 1.5 0 0 0 .44 1.06l7.25 7.25a.75.75 0 0 0 1.06 0l4.94-4.94a.75.75 0 0 0 0-1.06l-7.25-7.25A1.5 1.5 0 0 0 7.382 2H3.5ZM6.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
);

const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="m9.69 18.933.003.001a9.7 9.7 0 0 1-1.38-1.92 9.7 9.7 0 0 1-1.12-2.31A9.7 9.7 0 0 1 6 12.31V9.75a.75.75 0 0 1 1.5 0v2.56c0 .597.107 1.18.315 1.74a8.2 8.2 0 0 0 .84 1.94l.003.001a.75.75 0 0 1-1.03.805ZM10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM8.5 9a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
    </svg>
);

const VerifiedBadgeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);

const ChatBubbleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike }) => {
  const allTags = [...profile.interests, ...profile.hobbies];
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const navigate = useNavigate();
  const { locale } = useLocale();
  const { t } = useTranslations();

  const handleIcebreakerClick = (icebreaker: string) => {
    // Navigate to chat with the icebreaker message as a URL parameter
    navigate(`/${locale}/chat/${profile.id}?message=${encodeURIComponent(icebreaker)}`);
  };

  const handleChatClick = () => {
    navigate(`/${locale}/chat/${profile.id}`);
  };

  const BIO_TRUNCATE_LENGTH = 120;
  const isBioLong = profile.bio.length > BIO_TRUNCATE_LENGTH;

  return (
    <div className="relative h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.imageUrl})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 pb-28 md:pb-6 text-white w-full flex flex-col items-center">
        <div className="w-full mb-4">
            <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold">{profile.name}, {profile.age}</h1>
                {profile.verified && (
                    <VerifiedBadgeIcon className="w-8 h-8 text-blue-400" title="Verified" />
                )}
            </div>
            <div className="flex items-center gap-4 mt-2 opacity-90">
                <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-white/80" />
                    <p className="text-lg">{profile.occupation}</p>
                </div>
                <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-white/80" />
                    <p className="text-lg">{profile.country}</p>
                </div>
            </div>
             <div className="text-lg mt-2 opacity-90 transition-all duration-300">
                <p key={isBioExpanded ? 'expanded' : 'collapsed'} className="bio-fade-in">
                    {isBioLong && !isBioExpanded
                        ? `${profile.bio.substring(0, BIO_TRUNCATE_LENGTH)}...`
                        : profile.bio}
                    {isBioLong && (
                        <button
                            onClick={() => setIsBioExpanded(!isBioExpanded)}
                            className="font-semibold text-white/80 hover:text-white underline ml-2 bg-transparent border-none p-0 cursor-pointer"
                            aria-expanded={isBioExpanded}
                        >
                            {isBioExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </p>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                {allTags.slice(0, 5).map((tag, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                        <TagIcon className="w-4 h-4 text-white/70" />
                        <span>{tag}</span>
                    </div>
                ))}
            </div>

            {/* Icebreakers Section */}
            {profile.icebreakers && profile.icebreakers.length > 0 && (
                <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <ChatBubbleIcon className="w-5 h-5 text-pink-400" />
                        <h3 className="text-sm font-semibold text-white/90">Start a conversation</h3>
                    </div>
                    <div className="space-y-2">
                        {profile.icebreakers.map((icebreaker, index) => (
                            <button
                                key={index}
                                onClick={() => handleIcebreakerClick(icebreaker)}
                                className="w-full text-left px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm hover:bg-white/20 hover:border-pink-400/50 transition-all duration-200 group"
                            >
                                <span className="group-hover:text-pink-300 transition-colors">"{icebreaker}"</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-4">
          {/* Chat Button */}
          <button
            onClick={handleChatClick}
            className="relative flex-1 h-16 rounded-full flex items-center justify-center gap-2 transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 active:scale-95 shadow-lg"
            aria-label={`${t('chat_with_name', { name: profile.name })}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-white">{t('chat')}</span>
          </button>

          {/* Like Button */}
          <button
            onClick={onLike}
            disabled={!onLike}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out aurora-gradient ${onLike ? 'hover:scale-110 active:scale-90 aurora-pulse' : 'opacity-60 cursor-default'}`}
            aria-label={`${t('like')} ${profile.name}`}
          >
           <HeartIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
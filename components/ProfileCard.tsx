import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ProfileCardProps {
  profile: UserProfile;
}

const HeartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.16-1.23c-1.273-1.05-2.267-2.182-2.922-3.29a8.384 8.384 0 0 1-.942-3.805c0-2.812 2.03-5.068 5.197-5.068 1.54 0 2.91.596 3.872 1.566a3.872 3.872 0 0 1 3.872-1.566c3.167 0 5.197 2.256 5.197 5.068 0 1.558-.33 2.942-.942 3.805-1.423 2.226-3.8 4.22-6.082 5.518a15.247 15.247 0 0 1-1.383.597l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67-.006l-.004-.001Z" />
    </svg>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { locale } = useLocale();
  return (
    <div className="relative h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.imageUrl})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white w-full flex flex-col items-center">
        <div className="w-full mb-8">
            <h1 className="text-4xl font-bold">{profile.name}, {profile.age}</h1>
            <p className="text-lg mt-1 opacity-90">{profile.bio}</p>
        </div>
        <Link
          to={`/${locale}/match/${profile.id}`}
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 active:scale-100 aurora-gradient aurora-pulse"
          aria-label={`Like ${profile.name}`}
        >
         <HeartIcon />
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
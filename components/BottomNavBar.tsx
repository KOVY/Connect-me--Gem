import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const HomeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>
);
const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
);
const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
);

const BottomNavBar: React.FC = () => {
    const { locale } = useLocale();
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-pink-400' : 'text-gray-400 hover:text-white'}`;

    return (
        <nav className="h-20 bg-black/80 backdrop-blur-md border-t border-white/10 z-40 flex justify-around items-center">
            <NavLink to={`/${locale}/`} end className={navLinkClass}>
                <HomeIcon />
                <span className="text-xs font-medium">Discover</span>
            </NavLink>
            <NavLink to={`/${locale}/reels`} className={navLinkClass}>
                <PlayIcon />
                <span className="text-xs font-medium">Reels</span>
            </NavLink>
            <NavLink to={`/${locale}/profile/me`} className={navLinkClass}>
                <UserIcon />
                <span className="text-xs font-medium">Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNavBar;
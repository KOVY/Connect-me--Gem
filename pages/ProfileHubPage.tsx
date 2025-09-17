// FIX: Creating the `ProfileHubPage` component to display the user's profile management hub.
import React from 'react';
import { Link } from 'react-router-dom';
import ProfileHub from '../components/ProfileHub';
import { useLocale } from '../contexts/LocaleContext';

const ProfileHubPage: React.FC = () => {
    const { locale } = useLocale();
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                 <div className="mb-6">
                    <Link to={`/${locale}/`} className="text-pink-400 hover:underline">
                        &larr; Back to Discovery
                    </Link>
                    <h1 className="text-3xl font-bold mt-2">My Hub</h1>
                </div>
                <ProfileHub />
            </div>
        </div>
    );
};

export default ProfileHubPage;

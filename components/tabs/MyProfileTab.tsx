import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import CameraModal from '../CameraModal';
import ProfileCompletenessWidget from '../ProfileCompletenessWidget';
// FIX: Import PLACEHOLDER_AVATARS from the central constants file.
import { PLACEHOLDER_AVATARS } from '../../constants';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h1.372c.433 0 .84.183 1.123.473l.738.656a.75.75 0 0 0 .886 0l.738-.656A1.875 1.875 0 0 1 9.49 4.5h1.02c1.036 0 1.875.84 1.875 1.875v7.25c0 1.036-.84 1.875-1.875 1.875h-7.25A1.875 1.875 0 0 1 1.5 13.625v-7.25ZM10 9a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
        <path d="M10 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path fillRule="evenodd" d="M15.424 6.903a.75.75 0 0 1 .89-.51l3.582.651a.75.75 0 0 1 .598.84l-.65 3.583a.75.75 0 0 1-1.488-.27l.5-2.75-2.75.5a.75.75 0 0 1-.27-1.488l.001-.001Z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-4 h-4"}>
        <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L8 6.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L9.06 8l4.72 4.72a.75.75 0 1 1-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
);


const MyProfileTab: React.FC = () => {
  const { user, updateUser, isLoading, isLoggedIn, profileCompleteness, completionSuggestions } = useUser();
  const { locale } = useLocale();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [currentInterests, setCurrentInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setOccupation(user.occupation);
      setCurrentInterests(user.interests);
      setProfilePictureUrl(user.profilePictureUrl);
    }
  }, [user]);

  const handleChangePicture = () => {
    const currentIndex = PLACEHOLDER_AVATARS.indexOf(profilePictureUrl);
    const nextIndex = (currentIndex + 1) % PLACEHOLDER_AVATARS.length;
    setProfilePictureUrl(PLACEHOLDER_AVATARS[nextIndex]);
  };
  
  const handleAddInterest = () => {
    const newInterest = interestInput.trim();
    if (newInterest && !currentInterests.find(i => i.toLowerCase() === newInterest.toLowerCase())) {
        setCurrentInterests([...currentInterests, newInterest]);
        setInterestInput('');
    }
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddInterest();
      }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
      setCurrentInterests(currentInterests.filter(interest => interest !== interestToRemove));
  };


  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await updateUser({
          name,
          bio,
          occupation,
          interests: currentInterests,
          profilePictureUrl,
        });
    } catch (error) {
        console.error("Failed to save profile", error);
        // Here you could show an error message to the user
    } finally {
        setIsSaving(false);
    }
  };
  
  const handlePhotoTaken = (dataUrl: string) => {
    setProfilePictureUrl(dataUrl);
    setIsCameraModalOpen(false);
  };

  if (isLoading && !user) {
    return <div>Loading profile...</div>;
  }
  
  if (!isLoggedIn) {
      return (
        <div className="text-center">
            <h2 className="text-xl font-semibold">Edit Your Profile</h2>
            <p className="mt-2 text-gray-400">You must be logged in to edit your profile.</p>
             <Link 
                to={`/${locale}/login`}
                className="inline-block mt-6 px-8 py-3 rounded-full aurora-gradient font-semibold transition-transform hover:scale-105"
            >
                Login
            </Link>
        </div>
      )
  }

  return (
    <>
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Profile</h2>
            
            <ProfileCompletenessWidget 
                completeness={profileCompleteness}
                suggestions={completionSuggestions}
            />

            <form onSubmit={handleSaveChanges} className="space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
                <div className="mt-2 flex items-center gap-4">
                    <img src={profilePictureUrl} alt="Your profile picture" className="w-24 h-24 rounded-full object-cover" />
                    <div className="flex flex-col gap-2">
                        <button 
                            type="button" 
                            onClick={() => setIsCameraModalOpen(true)} 
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-full bg-pink-600 hover:bg-pink-700 font-semibold transition-colors"
                        >
                            <CameraIcon className="w-4 h-4" />
                            Take Photo
                        </button>
                        <button type="button" onClick={handleChangePicture} className="px-4 py-2 text-sm rounded-full bg-gray-600 hover:bg-gray-500 font-semibold transition-colors">
                            Choose Avatar
                        </button>
                    </div>
                </div>
                </div>
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                </div>
                 <div>
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">Occupation</label>
                    <input
                        type="text"
                        id="occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
                <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                </div>
                
                 <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-gray-300">Your Interests</label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="text"
                            id="interests"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={handleInterestKeyDown}
                            placeholder="Type an interest and press Enter"
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddInterest}
                            className="px-4 py-2 text-sm rounded-md bg-pink-600 hover:bg-pink-700 font-semibold transition-colors"
                        >
                            Add
                        </button>
                    </div>
                     <div className="mt-3 flex flex-wrap gap-2">
                        {currentInterests.map((interest) => (
                            <div key={interest} className="flex items-center gap-1.5 bg-gray-600 rounded-full px-3 py-1 text-sm font-medium text-white">
                                <span>{interest}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="text-gray-300 hover:text-white"
                                    aria-label={`Remove ${interest}`}
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-full aurora-gradient font-semibold transition-opacity disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                </div>
            </form>
        </div>
        <CameraModal
            isOpen={isCameraModalOpen}
            onClose={() => setIsCameraModalOpen(false)}
            onPhotoTaken={handlePhotoTaken}
        />
    </>
  );
};

export default MyProfileTab;
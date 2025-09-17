// FIX: Implementing the MyProfileTab component to allow users to edit their profile information.
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';

const PLACEHOLDER_AVATARS = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1740&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
];

const MyProfileTab: React.FC = () => {
  const { user, updateUser, isLoading } = useUser();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setInterests(user.interests.join(', '));
      setProfilePictureUrl(user.profilePictureUrl);
    }
  }, [user]);

  const handleChangePicture = () => {
    const currentIndex = PLACEHOLDER_AVATARS.indexOf(profilePictureUrl);
    const nextIndex = (currentIndex + 1) % PLACEHOLDER_AVATARS.length;
    setProfilePictureUrl(PLACEHOLDER_AVATARS[nextIndex]);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await updateUser({
          name,
          bio,
          interests: interests.split(',').map(i => i.trim()).filter(Boolean),
          profilePictureUrl,
        });
    } catch (error) {
        console.error("Failed to save profile", error);
        // Here you could show an error message to the user
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading && !user) {
    return <div>Loading profile...</div>;
  }
  
  if (!user) {
    return <div>Could not load user data.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Profile</h2>
      <form onSubmit={handleSaveChanges} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
          <div className="mt-2 flex items-center gap-4">
              <img src={profilePictureUrl} alt="Your profile picture" className="w-20 h-20 rounded-full object-cover" />
              <button type="button" onClick={handleChangePicture} className="px-4 py-2 text-sm rounded-full bg-gray-600 hover:bg-gray-500 font-semibold transition-colors">
                  Change Picture
              </button>
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
          <label htmlFor="interests" className="block text-sm font-medium text-gray-300">Interests (comma-separated)</label>
          <input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
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
  );
};

export default MyProfileTab;
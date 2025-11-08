import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserProfile } from '../types';

interface DiscoveryActionsProps {
  profile: UserProfile;
  onSuperLike?: () => void;
  onRewind?: () => void;
}

const DiscoveryActions: React.FC<DiscoveryActionsProps> = ({ profile, onSuperLike, onRewind }) => {
  const { user, useSuperLike, useRewind, useBoost } = useUser();
  const [showBoostConfirm, setShowBoostConfirm] = useState(false);
  const [showSuperLikeConfirm, setShowSuperLikeConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);

  const hasSuperLikes = (user?.superLikesRemaining ?? 0) > 0;
  const hasRewinds = (user?.rewindsRemaining ?? 0) > 0;
  const hasBoosts = (user?.boostsRemaining ?? 0) > 0;
  const isSubscribed = user?.subscription && new Date(user.subscription.expiryDate) > new Date();

  const handleSuperLike = async () => {
    if (!hasSuperLikes) {
      setShowUpgradeModal('superlike');
      return;
    }

    setIsProcessing('superlike');
    try {
      await useSuperLike(profile.id);
      setShowSuperLikeConfirm(false);
      if (onSuperLike) onSuperLike();
    } catch (error) {
      console.error("Super Like failed", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRewind = async () => {
    if (!hasRewinds) {
      setShowUpgradeModal('rewind');
      return;
    }

    setIsProcessing('rewind');
    try {
      await useRewind();
      if (onRewind) onRewind();
    } catch (error) {
      console.error("Rewind failed", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleBoost = async () => {
    if (!hasBoosts) {
      setShowUpgradeModal('boost');
      return;
    }

    setIsProcessing('boost');
    try {
      await useBoost();
      setShowBoostConfirm(false);
    } catch (error) {
      console.error("Boost failed", error);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <>
      {/* Action Buttons - Floating on the right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {/* Super Like Button */}
        <button
          onClick={() => hasSuperLikes ? setShowSuperLikeConfirm(true) : setShowUpgradeModal('superlike')}
          disabled={!!isProcessing}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          title="Super Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg>
          {hasSuperLikes && (
            <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {user?.superLikesRemaining === 999 ? '∞' : user?.superLikesRemaining}
            </span>
          )}
        </button>

        {/* Rewind Button */}
        <button
          onClick={handleRewind}
          disabled={!!isProcessing || !hasRewinds}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          title="Rewind"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
            <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
          </svg>
          {hasRewinds && user?.rewindsRemaining !== 999 && (
            <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {user?.rewindsRemaining}
            </span>
          )}
        </button>

        {/* Boost Button */}
        <button
          onClick={() => hasBoosts ? setShowBoostConfirm(true) : setShowUpgradeModal('boost')}
          disabled={!!isProcessing}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          title="Boost Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
          </svg>
          {hasBoosts && (
            <span className="absolute -top-1 -right-1 bg-white text-pink-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {user?.boostsRemaining}
            </span>
          )}
        </button>
      </div>

      {/* Super Like Confirmation Modal */}
      {showSuperLikeConfirm && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full border-2 border-blue-500/50">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Super Like {profile.name}?</h3>
              <p className="text-white/70 text-sm">
                They'll be notified that you're really interested! This shows up as a special notification.
              </p>
              <p className="text-blue-400 font-semibold mt-3 text-sm">
                {user?.superLikesRemaining === 999 ? 'Unlimited' : `${user?.superLikesRemaining} remaining`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuperLikeConfirm(false)}
                disabled={!!isProcessing}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuperLike}
                disabled={!!isProcessing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all disabled:opacity-50"
              >
                {isProcessing === 'superlike' ? 'Sending...' : 'Send Super Like'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost Confirmation Modal */}
      {showBoostConfirm && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full border-2 border-pink-500/50">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Boost Your Profile?</h3>
              <p className="text-white/70 text-sm">
                Your profile will be one of the top profiles in your area for 30 minutes! Get more views and matches.
              </p>
              <p className="text-pink-400 font-semibold mt-3 text-sm">
                {user?.boostsRemaining} boosts remaining
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBoostConfirm(false)}
                disabled={!!isProcessing}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBoost}
                disabled={!!isProcessing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-lg transition-all disabled:opacity-50"
              >
                {isProcessing === 'boost' ? 'Activating...' : 'Activate Boost'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold mb-4 aurora-text">Upgrade to Premium</h3>
            <p className="text-white/70 mb-4">
              {showUpgradeModal === 'superlike' && 'Super Likes are available for premium members. Get 5-10 Super Likes per day!'}
              {showUpgradeModal === 'rewind' && 'Rewind is available for premium members. Go back to profiles you accidentally passed!'}
              {showUpgradeModal === 'boost' && 'Profile Boosts are available for premium members. Get 1-5 boosts per month!'}
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Premium Benefits:</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>✓ 5-10 Super Likes per day</li>
                <li>✓ Unlimited rewinds</li>
                <li>✓ 1-5 Profile boosts per month</li>
                <li>✓ See who liked you</li>
                <li>✓ Ad-free experience</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(null)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(null);
                  window.location.href = `/${user?.id || 'en'}/profile/me/subscription`;
                }}
                className="flex-1 px-4 py-2 aurora-gradient rounded-lg transition-all"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoveryActions;

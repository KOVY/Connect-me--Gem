import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({ isOpen, onClose, userName = 'there' }) => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    setClaimed(true);
    // TODO: Volat API pro přidání 50 kreditů uživateli
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleBuyMore = () => {
    navigate(`/${locale}/profile/me/shop`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/95 to-pink-900/95 rounded-3xl p-8 shadow-2xl border border-white/10 animate-scale-in">
        {/* Confetti animation background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center">
          {!claimed ? (
            <>
              {/* Gift icon */}
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg animate-bounce-slow">
                <span className="text-5xl">🎁</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold mb-3 aurora-text">
                Vítej, {userName}! 🎉
              </h2>

              {/* Description */}
              <p className="text-white/80 mb-6 text-lg">
                Gratulujeme k registraci! Připravili jsme pro tebe uvítací bonus.
              </p>

              {/* Bonus card */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-5xl">🪙</span>
                  <span className="text-6xl font-bold aurora-text">50</span>
                </div>
                <p className="text-white/90 font-semibold text-lg">KREDITŮ ZDARMA</p>
                <p className="text-white/60 text-sm mt-2">
                  Použij je na dárečky pro své matche!
                </p>
              </div>

              {/* What you can do */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
                <p className="text-white/80 text-sm mb-3 font-semibold">S kredity můžeš:</p>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>💝</span>
                  <span>Posílat micro-dárečky (10-50 kreditů)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>⭐</span>
                  <span>Poslat Super Like (20 kreditů)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>🚀</span>
                  <span>Boostovat profil (30 kreditů)</span>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={handleClaim}
                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
              >
                Získat 50 kreditů 🎁
              </button>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-3 text-green-400">
                Skvěle! ✓
              </h2>

              <p className="text-white/80 mb-6 text-lg">
                Tvých 50 kreditů bylo přidáno!
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <p className="text-white/70 text-sm">
                  Nyní můžeš začít objevovat profily a posílat dárečky lidem, kteří tě zaujmou! 💕
                </p>
              </div>

              {/* Optional: Buy more credits */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyMore}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full font-semibold text-white transition-all"
                >
                  Koupit další kredity
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-white transition-all"
                >
                  Začít objevovat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBonusModal;

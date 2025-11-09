import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName = 'there' }) => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  if (!isOpen) return null;

  const handleBrowseShop = () => {
    navigate(`/${locale}/profile/me/shop`);
  };

  const handleStartDiscovering = () => {
    navigate(`/${locale}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/95 to-pink-900/95 rounded-3xl p-8 shadow-2xl border border-white/10 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-5xl">✨</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-3 aurora-text">
            Vítej na AURA, {userName}! 🎉
          </h2>

          {/* Description */}
          <p className="text-white/80 mb-6 text-lg">
            Jsi připraven(a) objevovat zajímavé lidi z celého světa?
          </p>

          {/* Features */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-purple-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Neomezené swipování</p>
                <p className="text-white/50 text-sm">Objevuj profily bez limitů</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-pink-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Matchování a chat</p>
                <p className="text-white/50 text-sm">Začni konverzace okamžitě</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Dárečky a Super Likes</p>
                <p className="text-white/50 text-sm">Vynikni mezi ostatními</p>
              </div>
            </div>
          </div>

          {/* Optional: Shop teaser */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
            <p className="text-white/90 text-sm mb-2">
              💡 <span className="font-semibold">Tip:</span> Získej kredity a posílej dárečky svým matchům
            </p>
            <p className="text-white/60 text-xs">
              Dárečky zvyšují šance na odpověď až o 3×!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleStartDiscovering}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Začít objevovat 🚀
            </button>

            <button
              onClick={handleBrowseShop}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-white border border-white/20 transition-all"
            >
              Prohlédnout Shop
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-white/40 text-xs mt-6">
            Připoj se k tisícům lidí, kteří už našli svůj match! 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

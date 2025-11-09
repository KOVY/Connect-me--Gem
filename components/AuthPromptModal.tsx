import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  swipeCount: number;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose, swipeCount }) => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate(`/${locale}/login`);
  };

  const handleSignup = () => {
    navigate(`/${locale}/onboarding`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-3xl p-8 shadow-2xl border border-white/10 animate-scale-in">
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
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-3 aurora-text">
            Líbí se ti tady? 💖
          </h2>

          {/* Description */}
          <p className="text-white/80 mb-2 text-lg">
            Právě jsi prošvihnul{swipeCount > 1 ? `(a) ${swipeCount}` : ''} profil{swipeCount > 1 ? 'y' : ''}!
          </p>
          <p className="text-white/60 mb-8 text-sm">
            Vytvoř si účet a pokračuj v objevování nových lidí, získej přístup k exkluzivním funkcím a začni chatovat! 🚀
          </p>

          {/* Benefits */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Neomezené swipování</p>
                <p className="text-white/50 text-sm">Objevuj kolik profilů chceš</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Chatování a matchování</p>
                <p className="text-white/50 text-sm">Navazuj skutečná spojení</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Dárečky a kredity zdarma</p>
                <p className="text-white/50 text-sm">Získej uvítací bonus 🎁</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignup}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Vytvořit účet zdarma
            </button>

            <button
              onClick={handleLogin}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-full font-semibold text-white border border-white/20 transition-all"
            >
              Už mám účet - Přihlásit se
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-white/40 text-xs mt-6">
            Pokračováním souhlasíš s našimi Podmínkami a Zásadami ochrany osobních údajů
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;

import React from 'react';
import { Link } from 'react-router-dom';
import { GIFTS } from '../constants';
import { useTranslations } from '../hooks/useTranslations';
import { useLocale } from '../contexts/LocaleContext';

interface GiftWallProps {
  onUnlock: () => void;
}

const GiftWall: React.FC<GiftWallProps> = ({ onUnlock }) => {
  const { t } = useTranslations();
  const { locale } = useLocale();

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10">
      <h3 className="text-xl font-bold aurora-text">{t('impress_and_chat')}</h3>
      <p className="text-white/70 mt-2 mb-6">{t('unlock_chat_prompt')}</p>
      
      <div className="flex justify-center items-center gap-4">
        {GIFTS.map(gift => (
          <button 
            key={gift.id} 
            onClick={onUnlock}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <span className="text-4xl transition-transform duration-300 group-hover:scale-125">{gift.icon}</span>
            <div className="text-sm">
              <p className="font-semibold text-white">{gift.name}</p>
              <p className="text-white/60">{gift.cost} credits</p>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-white/40 mt-6">
        {t('unlock_forever')}{' '}
        <Link to={`/${locale}/profile/me/shop`} className="underline hover:text-white">{t('buy_credits')}</Link>
      </p>
    </div>
  );
};

export default GiftWall;
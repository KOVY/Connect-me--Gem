import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { UserProfile } from '../types';

interface GiftUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: UserProfile;
  reason: 'cooldown' | 'daily_limit' | 'profile_limit';
  cooldownMinutes?: number;
  onGiftSelect: (giftType: 'coffee' | 'rose' | 'diamond') => void;
}

const GiftUnlockModal: React.FC<GiftUnlockModalProps> = ({
  isOpen,
  onClose,
  recipient,
  reason,
  cooldownMinutes = 0,
  onGiftSelect
}) => {
  const { t } = useTranslations();

  if (!isOpen) return null;

  const gifts = [
    {
      type: 'coffee' as const,
      emoji: '☕',
      name: t('gift_coffee'),
      price: '50 Kč',
      benefit: t('gift_coffee_benefit'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      type: 'rose' as const,
      emoji: '🌹',
      name: t('gift_rose'),
      price: '200 Kč',
      benefit: t('gift_rose_benefit'),
      color: 'from-pink-500 to-rose-500',
      popular: true
    },
    {
      type: 'diamond' as const,
      emoji: '💎',
      name: t('gift_diamond'),
      price: '500 Kč',
      benefit: t('gift_diamond_benefit'),
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const getReasonMessage = () => {
    switch (reason) {
      case 'cooldown':
        const hours = Math.floor(cooldownMinutes / 60);
        const mins = cooldownMinutes % 60;
        return t('cooldown_message', {
          name: recipient.name,
          time: hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
        });
      case 'daily_limit':
        return t('daily_limit_message');
      case 'profile_limit':
        return t('profile_limit_message', { name: recipient.name });
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl max-w-lg w-full shadow-2xl animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label={t('close')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={recipient.imageUrl}
              alt={recipient.name}
              className="w-20 h-20 rounded-full border-4 border-pink-500/30 object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {t('unlock_conversation')}
          </h2>
          <p className="text-white/70 text-sm">
            {getReasonMessage()}
          </p>
        </div>

        {/* Gifts */}
        <div className="p-6 pt-2 space-y-3">
          {gifts.map((gift) => (
            <button
              key={gift.type}
              onClick={() => onGiftSelect(gift.type)}
              className={`relative w-full p-4 rounded-2xl bg-gradient-to-r ${gift.color} bg-opacity-10 border-2 border-white/10 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group`}
            >
              {gift.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-xs font-bold">
                  {t('most_popular')}
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gift.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {gift.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold">{gift.name}</h3>
                    <span className="text-xl font-bold text-white">{gift.price}</span>
                  </div>
                  <p className="text-sm text-white/70">{gift.benefit}</p>
                </div>
              </div>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gift.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <p className="text-sm text-white/60 text-center">
              {t('or_upgrade_premium')}
            </p>
            <button className="w-full mt-3 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              {t('see_premium_plans')} 👑
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 text-white/50 hover:text-white/80 text-sm transition-colors"
          >
            {t('maybe_later')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftUnlockModal;

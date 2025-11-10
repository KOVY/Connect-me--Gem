import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

interface MessageLimitBannerProps {
  messagesRemaining: number;
  profileMessagesRemaining: number;
  cooldownMinutes: number;
  recipientName: string;
  onUpgradeClick: () => void;
}

const MessageLimitBanner: React.FC<MessageLimitBannerProps> = ({
  messagesRemaining,
  profileMessagesRemaining,
  cooldownMinutes,
  recipientName,
  onUpgradeClick
}) => {
  const { t } = useTranslations();
  const { locale } = useLocale();

  // Don't show if unlimited (Premium/VIP)
  if (messagesRemaining === 999) {
    return null;
  }

  const hours = Math.floor(cooldownMinutes / 60);
  const mins = cooldownMinutes % 60;
  const timeString = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;

  return (
    <div className="w-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-md">
      <div className="p-3 space-y-2">
        {/* Daily limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-300">
                <path fillRule="evenodd" d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 0 1 5.273 3h9.454a2.75 2.75 0 0 1 2.651 2.019l1.523 5.52c.066.239.099.485.099.731V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3.73Zm3.068-5.852A1.25 1.25 0 0 1 5.273 4.5h9.454a1.25 1.25 0 0 1 1.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 0 0-.86.49l-.606 1.02a1 1 0 0 1-.86.49H8.236a1 1 0 0 1-.894-.553l-.448-.894A1 1 0 0 0 6 11H2.53l.015-.062 1.523-5.52Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {t('daily_messages')}: <span className={messagesRemaining <= 3 ? 'text-red-400' : 'text-green-400'}>{messagesRemaining}/10</span>
              </p>
              <p className="text-xs text-white/60">{t('resets_at_midnight')}</p>
            </div>
          </div>

          {messagesRemaining === 0 && (
            <div className="text-xs text-red-400 font-semibold animate-pulse">
              {t('limit_reached')}!
            </div>
          )}
        </div>

        {/* Profile-specific limit */}
        {profileMessagesRemaining < 3 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1 h-1 rounded-full bg-pink-400"></div>
            <p className="text-white/70">
              {t('messages_with_profile', { name: recipientName, count: profileMessagesRemaining.toString() })}
            </p>
          </div>
        )}

        {/* Cooldown indicator */}
        {cooldownMinutes > 0 && (
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-pink-300">
                  {t('cooldown_active')}
                </p>
                <p className="text-xs text-white/60">
                  {t('next_message_in')} {timeString}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/${locale}/profile/me/subscription`}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-semibold text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            👑 {t('upgrade_premium')}
          </Link>
          <button
            onClick={onUpgradeClick}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-lg text-sm font-semibold text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            🎁 {t('send_gift')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageLimitBanner;

import React, { useEffect, useState } from 'react';
import { Clock, Gift, Zap } from 'lucide-react';
import { MessageSendResult } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface CooldownMessageProps {
  profileName: string;
  messageSendResult: MessageSendResult;
  onSendGift?: () => void;
  onUpgradePremium?: () => void;
}

/**
 * Smart Cooldown Messaging Component
 * Shows different messages based on cooldown type with psychological FOMO
 * "Emma je momentálně zaneprázdněná... Další zprávu můžeš poslat za 3h"
 */
export const CooldownMessage: React.FC<CooldownMessageProps> = ({
  profileName,
  messageSendResult,
  onSendGift,
  onUpgradePremium,
}) => {
  const { t } = useTranslations();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!messageSendResult.cooldownUntil) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const cooldownEnd = new Date(messageSendResult.cooldownUntil!).getTime();
      const diff = cooldownEnd - now;

      if (diff <= 0) {
        setTimeRemaining('0m');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [messageSendResult.cooldownUntil]);

  // 3-Hour Cooldown Message
  if (messageSendResult.reason === 'profile_cooldown_3h') {
    return (
      <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-3">
          <Clock className="w-12 h-12 text-orange-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {profileName} je momentálně zaneprázdněná
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Další zprávu můžeš poslat za <span className="font-bold text-orange-400">{timeRemaining}</span>
        </p>

        <div className="mt-6 space-y-3">
          <div className="text-left bg-black/30 rounded-lg p-4">
            <p className="text-xs text-white/50 mb-3">Nebo odemkni konverzaci dárkem:</p>
            <div className="space-y-2">
              <button
                onClick={onSendGift}
                className="w-full flex items-center justify-between bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg p-3 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☕</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Káva</div>
                    <div className="text-xs text-white/60">+10 zpráv okamžitě</div>
                  </div>
                </div>
                <div className="text-white font-bold">50 Kč</div>
              </button>

              <button
                onClick={onSendGift}
                className="w-full flex items-center justify-between bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/50 rounded-lg p-3 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌹</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Růže</div>
                    <div className="text-xs text-white/60">Neomezeno 24h</div>
                  </div>
                </div>
                <div className="text-white font-bold">200 Kč</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 24-Hour Cooldown (reached 2-3 messages limit)
  if (messageSendResult.reason === 'profile_cooldown_24h' || messageSendResult.reason === 'profile_daily_limit') {
    return (
      <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-3">
          <Clock className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Denní limit konverzace s {profileName}
        </h3>
        <p className="text-white/70 text-sm mb-2">
          Dosáhl/a jsi maximálního počtu zpráv s tímto profilem dnes
        </p>
        <p className="text-white/60 text-xs mb-4">
          Další zprávu můžeš poslat za <span className="font-bold text-red-400">{timeRemaining}</span>
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={onSendGift}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-6 py-3 font-bold text-white transition-all transform hover:scale-105"
          >
            <Gift className="w-5 h-5" />
            Odemkni dárkem
          </button>

          <button
            onClick={onUpgradePremium}
            className="w-full flex items-center justify-center gap-2 bg-yellow-600/20 hover:bg-yellow-600/30 border-2 border-yellow-500 rounded-full px-6 py-3 font-bold text-yellow-400 transition-all"
          >
            <Zap className="w-5 h-5" />
            Upgrade na Premium
          </button>

          <p className="text-xs text-white/50 mt-4">
            Premium: Neomezené zprávy, žádné cooldowns
          </p>
        </div>
      </div>
    );
  }

  // Daily Limit Reached (10/10 messages for FREE tier)
  if (messageSendResult.reason === 'daily_limit_reached') {
    return (
      <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/30 border border-purple-500/30 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-3">
          <Zap className="w-12 h-12 text-purple-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Denní limit zpráv vyčerpán ({messageSendResult.messagesRemaining}/{messageSendResult.messagesRemaining})
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Obnoví se zítra v 00:00
        </p>

        <div className="mt-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/40 rounded-lg p-6">
          <h4 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Upgrade na Premium
          </h4>
          <ul className="text-left space-y-2 text-sm text-white/80 mb-4">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Neomezené zprávy
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Žádné cooldowns
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> 50% sleva na dárky
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Žádné reklamy
            </li>
          </ul>

          <button
            onClick={onUpgradePremium}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full px-6 py-3 font-bold text-white transition-all transform hover:scale-105 mb-3"
          >
            Premium €9.99/měsíc
          </button>

          <button className="w-full text-white/60 hover:text-white/80 text-sm transition-colors">
            Možná později
          </button>
        </div>
      </div>
    );
  }

  return null;
};

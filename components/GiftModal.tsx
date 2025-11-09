import { useState, useEffect } from 'react';
import { X, Gift as GiftIcon, Sparkles, AlertCircle } from 'lucide-react';
import { AVAILABLE_GIFTS, Gift, calculateRecipientEarnings } from '../src/lib/gifts';
import { sendGift, getUserCreditBalance, type SendGiftResponse } from '../src/lib/giftService';
import { useUser } from '../contexts/UserContext';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export function GiftModal({ isOpen, onClose, recipientId, recipientName }: GiftModalProps) {
  const { user } = useUser();
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sendResult, setSendResult] = useState<SendGiftResponse | null>(null);

  // Load user's credit balance
  useEffect(() => {
    if (isOpen && user) {
      loadBalance();
    }
  }, [isOpen, user]);

  const loadBalance = async () => {
    if (!user) return;

    try {
      const balance = await getUserCreditBalance(user.id);
      setUserBalance(balance);
    } catch (err) {
      console.error('Failed to load balance:', err);
      setUserBalance(0);
    }
  };

  const handleSendGift = async () => {
    if (!selectedGift || !user) return;

    // Validation
    if (userBalance < selectedGift.creditCost) {
      setError('Nemáte dostatek kreditů. Navštivte Shop pro nákup.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendGift({
        recipientId,
        giftId: selectedGift.id,
        creditCost: selectedGift.creditCost,
      });

      setSendResult(result);
      setUserBalance(result.senderNewBalance);
      setSuccess(true);

      // Auto-close after 2.5 seconds
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se poslat dárek';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGift(null);
    setError(null);
    setSuccess(false);
    setSendResult(null);
    onClose();
  };

  if (!isOpen) return null;

  // Success state
  if (success && sendResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-bounce-slow">{selectedGift?.icon}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Dárek odeslán! 🎉</h2>
          <p className="text-purple-200 mb-4">
            Poslal(a) jsi <span className="font-bold">{selectedGift?.name}</span> uživateli{' '}
            <span className="font-bold">{recipientName}</span>
          </p>
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-sm text-purple-200 mb-1">Nový zůstatek</p>
            <p className="text-3xl font-bold text-white">{sendResult.senderNewBalance} kreditů</p>
          </div>
          <div className="confetti-animation">
            <span className="confetti">🎊</span>
            <span className="confetti">✨</span>
            <span className="confetti">🎉</span>
            <span className="confetti">💫</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GiftIcon className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Poslat dárek</h2>
              <p className="text-purple-100 text-sm">Pro {recipientName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Tvůj zůstatek:</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">{userBalance} kreditů</span>
          </div>
        </div>

        {/* Gift Selection Grid */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {AVAILABLE_GIFTS.map((gift) => {
              const canAfford = userBalance >= gift.creditCost;
              const isSelected = selectedGift?.id === gift.id;
              const earnings = calculateRecipientEarnings(gift.creditCost);

              return (
                <button
                  key={gift.id}
                  onClick={() => canAfford && setSelectedGift(gift)}
                  disabled={!canAfford}
                  className={`
                    relative p-6 rounded-2xl transition-all
                    ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-105 shadow-2xl'
                        : canAfford
                        ? 'bg-white/5 hover:bg-white/10 hover:scale-102'
                        : 'bg-gray-800/30 opacity-50 cursor-not-allowed'
                    }
                    ${canAfford ? 'border-2 border-purple-500/30' : 'border-2 border-gray-700/30'}
                  `}
                >
                  {/* Category Badge */}
                  {gift.category === 'luxury' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                      LUXUS
                    </div>
                  )}
                  {gift.category === 'premium' && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PREMIUM
                    </div>
                  )}

                  {/* Gift Icon */}
                  <div className="text-6xl mb-3 text-center">{gift.icon}</div>

                  {/* Gift Name */}
                  <h3 className="text-xl font-bold text-white mb-2 text-center">{gift.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-3 text-center">{gift.description}</p>

                  {/* Credit Cost */}
                  <div className="bg-black/30 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Cena:</span>
                      <span className="text-lg font-bold text-white">{gift.creditCost} kreditů</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Příjemce získá:</span>
                      <span className="text-sm font-medium text-green-400">
                        ${earnings.payoutUsd.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Insufficient Balance Warning */}
                  {!canAfford && (
                    <div className="mt-2 text-xs text-red-400 text-center">
                      Nedostatek kreditů
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-200 text-sm">{error}</p>
                {error.includes('Shop') && (
                  <a
                    href="/cs/profile/me/shop"
                    className="text-red-400 underline text-sm mt-1 inline-block hover:text-red-300"
                  >
                    Přejít do Shopu →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Send Button */}
          {selectedGift && (
            <button
              onClick={handleSendGift}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Odesílání...
                </>
              ) : (
                <>
                  <GiftIcon className="w-5 h-5" />
                  Poslat {selectedGift.name} ({selectedGift.creditCost} kreditů)
                </>
              )}
            </button>
          )}

          {/* Info Note */}
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-xs text-blue-200 text-center">
              💡 Dárky pomohou tvému oblíbenci vydělat kredity. 40% hodnoty dárku získá příjemce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

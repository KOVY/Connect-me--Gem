import React, { useState } from 'react';
import { Gift } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';

interface DirectGiftPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    gift: Gift;
    recipientName: string;
    recipientId: string;
    onPurchase: (giftId: string, recipientId: string) => Promise<void>;
}

/**
 * Modal pro přímý nákup dárku (Pay-per-Gift)
 * Pro FREE users kteří nemají kredity
 */
const DirectGiftPurchaseModal: React.FC<DirectGiftPurchaseModalProps> = ({
    isOpen,
    onClose,
    gift,
    recipientName,
    recipientId,
    onPurchase
}) => {
    const { t } = useTranslations();
    const { currency } = useLocale();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    // Calculate real-money price based on credits
    // 1 credit ≈ $0.01 (adjustable)
    const calculatePrice = (credits: number): number => {
        const basePrice = credits * 0.01;

        // Round to nice pricing
        if (credits <= 50) return 0.99;
        if (credits <= 100) return 1.49;
        if (credits <= 150) return 1.99;
        if (credits <= 200) return 2.49;
        if (credits <= 500) return 4.99;

        return Math.ceil(basePrice);
    };

    const price = calculatePrice(gift.cost);

    const handlePurchase = async () => {
        setIsProcessing(true);
        try {
            await onPurchase(gift.id, recipientId);
        } catch (error) {
            console.error('Purchase failed:', error);
            // Error is handled by parent
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (price: number, currency: string): string => {
        const currencySymbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            CZK: 'Kč',
            PLN: 'zł',
            CHF: 'CHF'
        };

        const symbol = currencySymbols[currency] || currency;

        if (currency === 'CZK') {
            return `${Math.round(price * 23)} ${symbol}`;
        }

        return `${symbol}${price.toFixed(2)}`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {t('send_gift')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Gift Preview */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                        <div className="text-center">
                            <div className="text-7xl mb-4 animate-bounce">
                                {gift.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{gift.name}</h3>
                            <p className="text-white/60 text-sm">
                                {t('send_to')} <span className="text-pink-400 font-semibold">{recipientName}</span>
                            </p>
                        </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-white/70">{t('gift_price')}:</span>
                            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                                {formatPrice(price, currency)}
                            </span>
                        </div>
                        <div className="text-xs text-white/50 space-y-1">
                            <p>💳 {t('one_time_payment')}</p>
                            <p>✨ {t('no_credits_needed')}</p>
                            <p>🎁 {t('instant_delivery')}</p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">💡</div>
                            <div className="text-sm text-white/80">
                                <p className="font-semibold mb-1">{t('tip')}:</p>
                                <p>{t('buy_credits_save_money')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 space-y-3">
                    {/* Purchase Button */}
                    <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/30"
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('processing')}...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                🎁 {t('buy_and_send_gift')} {formatPrice(price, currency)}
                            </span>
                        )}
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                    >
                        {t('maybe_later')}
                    </button>

                    {/* Secure Payment Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-white/50 pt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                        </svg>
                        <span>{t('secure_payment_stripe')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectGiftPurchaseModal;

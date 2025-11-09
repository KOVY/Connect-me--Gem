import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { redirectToCheckout } from '../lib/stripe';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';
import { CreditPackage } from '../lib/creditPricing';
import { calculateDiscount, formatPrice } from '../lib/creditPricing';
import { useTranslations } from '../hooks/useTranslations';

const CreditShop: React.FC = () => {
  const { currency } = useLocale();
  const { user, isLoading: userLoading } = useUser();
  const { t } = useTranslations();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load credit packages for current currency
  useEffect(() => {
    async function loadPackages() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('credit_pricing')
          .select('*')
          .eq('currency', currency.toUpperCase())
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;

        const mappedPackages: CreditPackage[] = (data || []).map(pkg => ({
          id: pkg.id,
          packageName: pkg.package_name,
          creditAmount: pkg.credit_amount,
          currency: pkg.currency,
          price: parseFloat(pkg.price),
          priceUsd: parseFloat(pkg.price_usd),
          isActive: pkg.is_active,
          sortOrder: pkg.sort_order,
          discountPercent: calculateDiscount(pkg.credit_amount, parseFloat(pkg.price_usd)),
        }));

        setPackages(mappedPackages);
      } catch (err) {
        console.error('Error loading packages:', err);
        setError('Failed to load credit packages');
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, [currency]);

  const handlePurchase = async (pkg: CreditPackage) => {
    if (!user) {
      setError('You must be logged in to purchase credits');
      return;
    }

    try {
      setPurchasing(pkg.id);
      setError(null);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Redirect to Stripe Checkout
      await redirectToCheckout(pkg, session.access_token);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Failed to initiate purchase');
      setPurchasing(null);
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (curr: string): string => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CZK': 'Kč',
      'PLN': 'zł',
      'CAD': 'C$',
      'AUD': 'A$',
    };
    return symbols[curr] || curr;
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white/70">{t('loading_shop')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 aurora-text">{t('credit_shop')}</h1>
        <p className="text-white/70 text-lg">
          {t('get_credits_description')} 💎
        </p>

        {/* Current Balance */}
        {user && (
          <div className="mt-6 inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div className="text-left">
                <p className="text-white/60 text-xs">{t('your_balance')}</p>
                <p className="text-white font-bold text-xl">{user.credits || 0} {t('credits_label')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Credit Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {packages.map((pkg, index) => {
          const isPopular = pkg.packageName === 'Popular';
          const isBestValue = pkg.packageName === 'Best Value';
          const isPurchasing = purchasing === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative bg-gradient-to-br ${
                isBestValue
                  ? 'from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50'
                  : isPopular
                  ? 'from-pink-500/20 to-purple-500/20 border-2 border-pink-500/50'
                  : 'from-purple-900/50 to-pink-900/50 border border-white/10'
              } rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              {/* Badge */}
              {(isPopular || isBestValue) && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                  isBestValue
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500'
                }`}>
                  {isBestValue ? '🏆 BEST VALUE' : '⭐ POPULAR'}
                </div>
              )}

              {/* Package Name */}
              <h3 className="text-xl font-bold text-white mb-2 mt-2">{pkg.packageName}</h3>

              {/* Credit Amount */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold aurora-text">{pkg.creditAmount}</span>
                <span className="text-white/60">{t('credits_unit')}</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-white">
                  {formatPrice(pkg.price, pkg.currency, getCurrencySymbol(pkg.currency))}
                </div>
                {pkg.discountPercent > 0 && (
                  <div className="mt-1">
                    <span className="inline-block bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded">
                      {t('save_percent', { percent: pkg.discountPercent.toString() })}
                    </span>
                  </div>
                )}
              </div>

              {/* Cost per credit */}
              <p className="text-white/50 text-sm mb-6">
                {formatPrice(pkg.price / pkg.creditAmount, pkg.currency, getCurrencySymbol(pkg.currency))} {t('per_credit')}
              </p>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={isPurchasing || !user}
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                  isPurchasing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : isBestValue
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    : isPopular
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                    : 'bg-white/10 hover:bg-white/20'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPurchasing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('processing')}
                  </span>
                ) : !user ? (
                  t('login_required')
                ) : (
                  t('buy_now')
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* What you can do with credits */}
      <div className="bg-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center aurora-text">{t('what_can_you_do')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gifts */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💝</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('send_gifts_title')}</h3>
            <p className="text-white/60 text-sm">
              {t('send_gifts_description')}
            </p>
          </div>

          {/* Super Likes */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⭐</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('super_likes_title')}</h3>
            <p className="text-white/60 text-sm">
              {t('super_likes_description')}
            </p>
          </div>

          {/* Profile Boost */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('boost_profile_title')}</h3>
            <p className="text-white/60 text-sm">
              {t('boost_profile_description')}
            </p>
          </div>
        </div>
      </div>

      {/* Earn credits info */}
      <div className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('did_you_know')}</h3>
            <p className="text-white/70 text-sm" dangerouslySetInnerHTML={{ __html: t('earn_credits_info') }}></p>
            <span className="text-white/50 block mt-2 text-xs">
              {t('platform_commission')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditShop;

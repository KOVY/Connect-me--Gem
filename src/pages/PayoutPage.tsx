import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  getUserBalance,
  getPayoutHistory,
  getPayoutCurrencies,
  requestPayout,
  calculatePayoutAmount,
  MIN_PAYOUT_USD,
  type UserBalance,
  type PayoutHistoryItem,
  type PayPalDetails,
  type BankAccountDetails,
} from '../lib/payoutService';
import { useUser } from '../hooks/useUser';

export function PayoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  // State
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [history, setHistory] = useState<PayoutHistoryItem[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'bank_account'>('paypal');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
    accountHolderName: '',
    iban: '',
    bankName: '',
    swiftCode: '',
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [balanceData, historyData, currenciesData] = await Promise.all([
        getUserBalance(),
        getPayoutHistory(),
        getPayoutCurrencies(),
      ]);

      setBalance(balanceData);
      setHistory(historyData);
      setCurrencies(currenciesData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Nepodařilo se načíst data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!balance || balance.cash_balance_usd < MIN_PAYOUT_USD) {
      setError(`Minimální výplata je $${MIN_PAYOUT_USD} USD`);
      return;
    }

    if (paymentMethod === 'paypal' && !paypalEmail) {
      setError('Zadejte PayPal email');
      return;
    }

    if (paymentMethod === 'bank_account' && !bankDetails.accountHolderName) {
      setError('Vyplňte údaje o bankovním účtu');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentDetails = paymentMethod === 'paypal'
        ? { email: paypalEmail } as PayPalDetails
        : bankDetails;

      const response = await requestPayout({
        currency: selectedCurrency,
        paymentMethod,
        paymentDetails,
      });

      setSuccess(true);

      // Refresh data
      await loadData();

      // Reset form
      setPaypalEmail('');
      setBankDetails({
        accountHolderName: '',
        iban: '',
        bankName: '',
        swiftCode: '',
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se vytvořit žádost';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRate = currencies.find(c => c.code === selectedCurrency);
  const payoutCalculation = balance && selectedRate
    ? calculatePayoutAmount(balance.cash_balance_usd, selectedCurrency, selectedRate.rateToUsd)
    : null;

  const canRequestPayout = balance && balance.cash_balance_usd >= MIN_PAYOUT_USD;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Načítání...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zpět
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Žádost o výplatu</h1>
          <p className="text-purple-200">Vyžádejte si své vydělané kredity jako hotovost</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Cash Balance */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-white" />
              <span className="text-green-200 text-sm font-medium">K dispozici</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${balance?.cash_balance_usd.toFixed(2) || '0.00'}
            </div>
            <div className="text-green-200 text-sm">
              Po 60% provizi platformy
            </div>
          </div>

          {/* Earned Credits */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
              <span className="text-purple-200 text-sm font-medium">Vydělané</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {balance?.earned_credits.toLocaleString() || 0}
            </div>
            <div className="text-purple-200 text-sm">
              kreditů z dárků
            </div>
          </div>

          {/* Lifetime Earnings */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
              <span className="text-yellow-200 text-sm font-medium">Celkem</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${balance?.lifetime_earnings_usd.toFixed(2) || '0.00'}
            </div>
            <div className="text-yellow-200 text-sm">
              vydělali jste celkem
            </div>
          </div>
        </div>

        {/* Payout Request Form */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Nová žádost o výplatu</h2>

          {!canRequestPayout && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 font-medium">Minimální výplata je ${MIN_PAYOUT_USD} USD</p>
                <p className="text-yellow-300 text-sm mt-1">
                  Aktuální zůstatek: ${balance?.cash_balance_usd.toFixed(2) || '0.00'}
                </p>
                <p className="text-yellow-300 text-sm">
                  Chybí vám ještě: ${(MIN_PAYOUT_USD - (balance?.cash_balance_usd || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-200 font-medium">Žádost byla úspěšně odeslána!</p>
                <p className="text-green-300 text-sm mt-1">
                  Vaše žádost o výplatu bude zpracována do 3-5 pracovních dnů.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-white font-medium mb-2">Měna výplaty</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!canRequestPayout}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Payout Amount Display */}
            {payoutCalculation && (
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Obdržíte:</span>
                  <span className="text-2xl font-bold text-white">
                    {selectedRate?.symbol}{payoutCalculation.userReceives.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-purple-300 mt-2">
                  Kurz: 1 USD = {(1 / selectedRate.rateToUsd).toFixed(4)} {selectedCurrency}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-white font-medium mb-2">Způsob platby</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  disabled={!canRequestPayout}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  } ${!canRequestPayout && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="text-white font-bold mb-1">PayPal</div>
                  <div className="text-sm text-gray-300">1-2 dny, poplatek ~2%</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_account')}
                  disabled={!canRequestPayout}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'bank_account'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  } ${!canRequestPayout && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="text-white font-bold mb-1">Bankovní účet</div>
                  <div className="text-sm text-gray-300">3-5 dnů, poplatek ~0.5%</div>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'paypal' ? (
              <div>
                <label className="block text-white font-medium mb-2">PayPal Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="vas-email@example.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!canRequestPayout}
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Jméno majitele účtu</label>
                  <input
                    type="text"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                    placeholder="Jan Novák"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!canRequestPayout}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">IBAN (pro EU)</label>
                  <input
                    type="text"
                    value={bankDetails.iban}
                    onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                    placeholder="CZ65 0800 0000 1920 0014 5399"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!canRequestPayout}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Název banky</label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    placeholder="Česká spořitelna"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!canRequestPayout}
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">SWIFT/BIC kód (pro mezinárodní)</label>
                  <input
                    type="text"
                    value={bankDetails.swiftCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                    placeholder="GIBACZPX"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!canRequestPayout}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canRequestPayout || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Odesílání...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  Požádat o výplatu
                </>
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-xs text-blue-200">
              💡 <strong>Poznámka:</strong> Všechny výplaty jsou kontrolovány administrátorem. Zpracování trvá 3-5 pracovních dnů.
              Platforma si účtuje 60% provizi, kterou již máte odečtenou z vašeho zůstatku.
            </p>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Historie výplat</h2>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Zatím jste nepožádali o žádnou výplatu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {item.status === 'pending' && <Clock className="w-5 h-5 text-yellow-400" />}
                      {item.status === 'processing' && <Clock className="w-5 h-5 text-blue-400" />}
                      {item.status === 'rejected' && <XCircle className="w-5 h-5 text-red-400" />}
                      {item.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}

                      <div>
                        <div className="text-white font-medium">
                          {item.currency === 'USD' ? '$' : item.currency + ' '}
                          {item.payout_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('cs-CZ', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'pending' ? 'text-yellow-400' :
                        item.status === 'processing' ? 'text-blue-400' :
                        'text-red-400'
                      }`}>
                        {item.status === 'completed' && 'Dokončeno'}
                        {item.status === 'pending' && 'Čeká na schválení'}
                        {item.status === 'processing' && 'Zpracovává se'}
                        {item.status === 'approved' && 'Schváleno'}
                        {item.status === 'rejected' && 'Zamítnuto'}
                        {item.status === 'failed' && 'Selhalo'}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {item.payment_method.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-2 text-sm text-gray-400 bg-gray-900/50 rounded p-2">
                      {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

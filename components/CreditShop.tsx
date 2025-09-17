// FIX: Creating the `CreditShop` component.
import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocale } from '../contexts/LocaleContext';
import { CREDIT_PACKAGES } from '../constants';
import { CreditPackage } from '../types';

const CreditShop: React.FC = () => {
    const { purchaseCredits, isLoading } = useUser();
    const { currency } = useLocale();
    const [isPurchasing, setIsPurchasing] = React.useState<string | null>(null);

    const packagesForLocale = CREDIT_PACKAGES.filter(p => p.currency === currency);

    const handlePurchase = async (pkg: CreditPackage) => {
        setIsPurchasing(pkg.id);
        try {
            // FIX: The purchaseCredits function expects the package ID, not credits and price.
            await purchaseCredits(pkg.id);
        } catch (error) {
            console.error("Purchase failed", error);
        } finally {
            setIsPurchasing(null);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Buy Credits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packagesForLocale.map(pkg => (
                    <div key={pkg.id} className="p-6 bg-gray-800 rounded-lg text-center flex flex-col justify-between">
                        <div>
                            <p className="text-3xl font-bold aurora-text">{pkg.credits}</p>
                            <p className="text-lg text-white/80">Credits</p>
                        </div>
                        <button
                            onClick={() => handlePurchase(pkg)}
                            disabled={isLoading || !!isPurchasing}
                            className="mt-6 w-full px-4 py-2 rounded-full aurora-gradient font-semibold transition-opacity disabled:opacity-50"
                        >
                            {isPurchasing === pkg.id ? 'Processing...' : `Buy for ${pkg.price} ${pkg.currency}`}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreditShop;
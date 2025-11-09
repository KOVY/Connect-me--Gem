import { useState, useEffect } from 'react';
import { Package, Sparkles, TrendingUp, Gift as GiftIcon, Send } from 'lucide-react';
import { AVAILABLE_GIFTS, type Gift } from '../lib/gifts';

interface InventoryItem extends Gift {
  quantity: number;
  lastReceived?: string;
}

export function GiftInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedGift, setSelectedGift] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - In production, fetch from backend
  useEffect(() => {
    setTimeout(() => {
      const mockInventory: InventoryItem[] = [
        { ...AVAILABLE_GIFTS[0], quantity: 12, lastReceived: '2025-01-08' },
        { ...AVAILABLE_GIFTS[1], quantity: 8, lastReceived: '2025-01-09' },
        { ...AVAILABLE_GIFTS[2], quantity: 3, lastReceived: '2025-01-07' },
        { ...AVAILABLE_GIFTS[3], quantity: 1, lastReceived: '2025-01-05' },
        { ...AVAILABLE_GIFTS[4], quantity: 0 },
      ];
      setInventory(mockInventory);
      setIsLoading(false);
    }, 800);
  }, []);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.creditCost), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-8">
            <Package className="w-12 h-12 text-white animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-24 md:pb-8">
      {/* Header with Stats */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-gradient-x"></div>

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white">Tvůj sklad dárků</h1>
            </div>
            <p className="text-purple-200 text-lg">
              Dárky, které jsi obdržel(a) od ostatních uživatelů
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Items */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <GiftIcon className="w-6 h-6 text-blue-400" />
                  <div className="text-xs text-blue-300 font-medium">Celkem dárků</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalItems}</div>
                <div className="text-sm text-blue-200">kusů ve skladu</div>
              </div>
            </div>

            {/* Total Value */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  <div className="text-xs text-yellow-300 font-medium">Hodnota</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalValue}</div>
                <div className="text-sm text-yellow-200">kreditů</div>
              </div>
            </div>

            {/* Types */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <div className="text-xs text-purple-300 font-medium">Typy</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {inventory.filter(i => i.quantity > 0).length}
                </div>
                <div className="text-sm text-purple-200">z {inventory.length} dostupných</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item, index) => {
            const hasItems = item.quantity > 0;

            return (
              <div
                key={item.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect */}
                {hasItems && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                )}

                {/* Card */}
                <div className={`relative backdrop-blur-2xl border rounded-3xl p-6 transition-all duration-300 ${
                  hasItems
                    ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-105 cursor-pointer'
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
                  onClick={() => hasItems && setSelectedGift(item)}
                >
                  {/* Quantity Badge */}
                  {hasItems && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-md animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                          ×{item.quantity}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gift Icon */}
                  <div className={`text-7xl mb-4 text-center transition-all duration-300 ${
                    hasItems ? 'group-hover:scale-110 group-hover:rotate-12' : 'grayscale'
                  }`}>
                    {item.icon}
                  </div>

                  {/* Gift Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-white text-xl font-bold mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-center space-x-1">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{item.creditCost}</span>
                      <span className="text-yellow-300 text-sm">kreditů</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center justify-center mb-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      item.category === 'luxury'
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30'
                        : item.category === 'premium'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/10 text-gray-300 border border-white/10'
                    }`}>
                      {item.category === 'luxury' && '💎 Luxusní'}
                      {item.category === 'premium' && '⭐ Premium'}
                      {item.category === 'basic' && '🌟 Základní'}
                    </span>
                  </div>

                  {/* Last Received */}
                  {hasItems && item.lastReceived && (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">
                        Naposledy:{' '}
                        {new Date(item.lastReceived).toLocaleDateString('cs-CZ', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  )}

                  {/* Empty State */}
                  {!hasItems && (
                    <div className="text-center">
                      <p className="text-gray-500 text-xs">Zatím nemáš žádný</p>
                    </div>
                  )}

                  {/* Quick Send Button */}
                  {hasItems && (
                    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-bold py-2 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Poslat někomu</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-8">
                <Package className="w-16 h-16 text-white/50" />
              </div>
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Tvůj sklad je prázdný</h3>
            <p className="text-gray-400 mb-6">Začni objevovat profily a získej své první dárky!</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Začít objevovat
            </a>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative bg-white/5 backdrop-blur-2xl border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold mb-2">💡 Jak získat více dárků?</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Buď aktivní - přidej si atraktivní fotky a vyplň celý profil</li>
                  <li>• Odpovídej na zprávy rychle a přátelsky</li>
                  <li>• Používej Reels - krátká videa přitáhnou více pozornosti</li>
                  <li>• Posílej dárky ostatním - oni se ti to často oplatí!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

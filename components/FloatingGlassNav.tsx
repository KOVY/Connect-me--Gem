import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gift, Sparkles, User, Heart, Zap, ShoppingBag } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { getUserBalance } from '../src/lib/payoutService';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';
import { NotificationBell } from './NotificationBell';

export function FloatingGlassNav() {
  const { user, isLoggedIn, signOut } = useUser();
  const { locale } = useLocale();
  const { t } = useTranslations();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Load user balance
  useEffect(() => {
    if (isLoggedIn) {
      getUserBalance().then(data => setBalance(data.balance)).catch(() => setBalance(0));
    }
  }, [isLoggedIn]);

  // Handle scroll for glass effect intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { icon: Heart, label: t('discover'), path: `/${locale}/`, gradient: 'from-pink-500 to-rose-500' },
    { icon: Zap, label: t('reels'), path: `/${locale}/reels`, gradient: 'from-purple-500 to-indigo-500' },
    { icon: ShoppingBag, label: t('shop'), path: `/${locale}/profile/me/shop`, gradient: 'from-yellow-500 to-orange-500' },
    { icon: Gift, label: t('gifts'), path: `/${locale}/profile/me/inventory`, gradient: 'from-emerald-500 to-teal-500' },
    { icon: User, label: t('profile'), path: `/${locale}/profile/me`, gradient: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <>
      {/* Floating Glass Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-black/40 shadow-2xl shadow-purple-500/20'
          : 'backdrop-blur-md bg-black/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Animated gradient */}
            <Link to={`/${locale}/`} className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full p-2">
                  <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AURA
              </span>
            </Link>

            {/* Center - Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {menuItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = location?.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right - Credits Display (Desktop) */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center space-x-6">
                {/* Credits Balance */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <Link
                    to={`/${locale}/profile/me/shop`}
                    className="relative flex items-center space-x-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-white font-bold">{balance.toLocaleString()}</span>
                    <span className="text-yellow-300 text-sm">{t('credits_unit')}</span>
                  </Link>
                </div>

                {/* Gift Inventory Quick Access */}
                <Link
                  to={`/${locale}/profile/me/inventory`}
                  className="group relative flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all duration-300"
                >
                  <Gift className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-white text-sm">{t('inventory')}</span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link>
              </div>
            )}

            {/* Right - Notifications & Menu */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <NotificationBell />

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative group"
                aria-label="Menu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Glass Menu Overlay */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 ${
        isMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Content */}
        <div className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 ${
          isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="max-w-2xl w-full space-y-4">
            {/* User Info Card */}
            {isLoggedIn && user && (
              <div className="relative group mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md animate-pulse"></div>
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt={user.name}
                        className="relative w-16 h-16 rounded-full border-2 border-white/20 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold">{user.name}</h3>
                      <p className="text-purple-300 text-sm">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-bold text-lg">{balance}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{t('credits_unit')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location?.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500`}></div>

                    {/* Card */}
                    <div className={`relative backdrop-blur-2xl border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} border-white/30 shadow-2xl`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20'
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <Icon className={`w-6 h-6 transition-all duration-300 ${
                            isActive
                              ? 'text-white'
                              : 'text-purple-300 group-hover:text-white group-hover:scale-110'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg transition-colors ${
                            isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                          }`}>
                            {item.label}
                          </h3>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Credits (visible only when menu open on mobile) */}
            {isLoggedIn && (
              <div className="md:hidden mt-6">
                <Link
                  to={`/${locale}/profile/me/shop`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-2xl border border-yellow-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                        <div>
                          <p className="text-yellow-300 text-sm">{t('your_balance')}</p>
                          <p className="text-white font-bold text-2xl">{balance.toLocaleString()} {t('credits_unit')}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
                        {t('top_up')}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Login / Logout Button */}
            <div className="mt-6 pt-6 border-t border-white/10">
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    try {
                      await signOut();
                      window.location.href = `/${locale}/login`;
                    } catch (error) {
                      console.error('Failed to sign out:', error);
                    }
                  }}
                  className="group relative block w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">{t('logout')}</span>
                    </div>
                  </div>
                </button>
              ) : (
                <Link
                  to={`/${locale}/login`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">{t('login_or_sign_up')}</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

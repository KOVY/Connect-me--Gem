import { Link, useLocation } from 'react-router-dom';
import { Heart, Zap, MessageCircle, User, Plus } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';
import { useState } from 'react';

export function BottomActionBar() {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = [
    {
      icon: Heart,
      label: t('discover'),
      path: `/${locale}/`,
      color: 'from-pink-500 to-rose-500',
      activeColor: 'text-pink-400',
    },
    {
      icon: Zap,
      label: t('reels'),
      path: `/${locale}/reels`,
      color: 'from-purple-500 to-indigo-500',
      activeColor: 'text-purple-400',
    },
    {
      icon: Plus,
      label: t('shop'),
      path: `/${locale}/profile/me/shop`,
      color: 'from-yellow-500 to-orange-500',
      activeColor: 'text-yellow-400',
      isCenter: true,
    },
    {
      icon: MessageCircle,
      label: t('messages'),
      path: `/${locale}/messages`,
      color: 'from-blue-500 to-cyan-500',
      activeColor: 'text-blue-400',
    },
    {
      icon: User,
      label: t('profile'),
      path: `/${locale}/profile/me`,
      color: 'from-emerald-500 to-teal-500',
      activeColor: 'text-emerald-400',
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <div className="h-24 md:hidden"></div>

      {/* Bottom Action Bar - Mobile Only with Enhanced Apple Glass Morphism */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Multi-layer glass morphism background for depth */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-t from-black/95 via-black/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>

        {/* Subtle top border glow - Apple style */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent blur-sm"></div>

        {/* Floating glass container */}
        <div className="relative px-3 py-2 pb-safe">
          {/* Inner frosted glass pill */}
          <div className="mx-2 px-3 py-2 rounded-[28px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-1">
              {actions.map((action, index) => {
                const Icon = action.icon;
                const isActive = location.pathname === action.path;
                const isCenter = action.isCenter;

                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
                      isCenter ? 'flex-shrink-0' : 'flex-1'
                    }`}
                  >
                    {/* Center button (Shop) - Special elevated styling */}
                    {isCenter ? (
                      <div className="relative group -mt-10">
                        {/* Outer glow ring */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-full blur-2xl opacity-40 group-hover:opacity-60 group-active:opacity-70 transition-all duration-300 animate-pulse`}></div>

                        {/* Button with enhanced glass effect */}
                        <div className={`relative bg-gradient-to-br ${action.color} rounded-full p-4 shadow-2xl transform transition-all duration-300 border-2 border-white/20 ${
                          isActive ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'
                        }`}>
                          {/* Inner glass reflection */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                          <Icon className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
                        </div>

                        {/* Label below */}
                        <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap transition-all duration-300 ${
                          isActive ? action.activeColor : 'text-white/50'
                        }`}>
                          {action.label}
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Regular buttons with pill shape */}
                        <div className="relative group">
                          {/* Active indicator background glow */}
                          {isActive && (
                            <>
                              <div className={`absolute -inset-1 bg-gradient-to-r ${action.color} rounded-2xl blur-md opacity-30`}></div>
                              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-2xl opacity-20`}></div>
                            </>
                          )}

                          {/* Icon container with glass effect */}
                          <div className={`relative rounded-[20px] p-2.5 transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${action.color} shadow-lg scale-105`
                              : 'bg-white/5 group-hover:bg-white/10 group-active:scale-95 border border-transparent group-hover:border-white/10'
                          }`}>
                            {/* Glass reflection on active */}
                            {isActive && (
                              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                            )}
                            <Icon
                              className={`w-5 h-5 transition-colors duration-300 relative z-10 ${
                                isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                              }`}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                          </div>
                        </div>

                        {/* Label */}
                        <span className={`text-[10px] font-medium transition-all duration-300 ${
                          isActive
                            ? `${action.activeColor} font-bold`
                            : 'text-white/50 group-hover:text-white/70'
                        }`}>
                          {action.label}
                        </span>

                        {/* Active indicator dot */}
                        {isActive && (
                          <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${action.color} animate-pulse shadow-lg`}></div>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Safe area padding for modern phones with gradient */}
        <div className="h-safe bg-gradient-to-t from-black to-transparent"></div>
      </div>
    </>
  );
}

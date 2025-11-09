import { Link, useLocation } from 'react-router-dom';
import { Heart, Zap, MessageCircle, User, Plus } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useState } from 'react';

export function BottomActionBar() {
  const { locale } = useLocale();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const actions = [
    {
      icon: Heart,
      label: 'Objevuj',
      path: `/${locale}/`,
      color: 'from-pink-500 to-rose-500',
      activeColor: 'text-pink-400',
    },
    {
      icon: Zap,
      label: 'Reels',
      path: `/${locale}/reels`,
      color: 'from-purple-500 to-indigo-500',
      activeColor: 'text-purple-400',
    },
    {
      icon: Plus,
      label: 'Shop',
      path: `/${locale}/profile/me/shop`,
      color: 'from-yellow-500 to-orange-500',
      activeColor: 'text-yellow-400',
      isCenter: true,
    },
    {
      icon: MessageCircle,
      label: 'Zprávy',
      path: `/${locale}/messages`,
      color: 'from-blue-500 to-cyan-500',
      activeColor: 'text-blue-400',
    },
    {
      icon: User,
      label: 'Profil',
      path: `/${locale}/profile/me`,
      color: 'from-emerald-500 to-teal-500',
      activeColor: 'text-emerald-400',
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <div className="h-20 md:hidden"></div>

      {/* Bottom Action Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Glass morphism background */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-t from-black/90 via-black/80 to-black/60"></div>

        {/* Gradient glow at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        {/* Action buttons */}
        <div className="relative px-6 pb-safe">
          <div className="flex items-end justify-between pt-2 pb-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const isActive = location.pathname === action.path;
              const isCenter = action.isCenter;

              return (
                <Link
                  key={action.path}
                  to={action.path}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex flex-col items-center space-y-1 transition-all duration-300 ${
                    isCenter ? '-mt-8' : 'flex-1'
                  }`}
                >
                  {/* Center button (Shop) - Special styling */}
                  {isCenter ? (
                    <div className="relative group">
                      {/* Outer glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-full blur-xl opacity-60 group-hover:opacity-100 group-active:opacity-100 transition-opacity animate-pulse`}></div>

                      {/* Button */}
                      <div className={`relative bg-gradient-to-r ${action.color} rounded-full p-4 shadow-2xl transform transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105 group-active:scale-95'
                      }`}>
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>

                      {/* Label */}
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                        isActive ? action.activeColor : 'text-white/60'
                      }`}>
                        {action.label}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Regular buttons */}
                      <div className="relative group">
                        {/* Active indicator glow */}
                        {isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-2xl blur-lg opacity-50 animate-pulse`}></div>
                        )}

                        {/* Icon container */}
                        <div className={`relative rounded-2xl p-2.5 transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${action.color} shadow-lg scale-110`
                            : 'bg-white/5 group-hover:bg-white/10 group-active:scale-95'
                        }`}>
                          <Icon
                            className={`w-6 h-6 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                        </div>
                      </div>

                      {/* Label */}
                      <span className={`text-xs font-medium transition-all duration-300 ${
                        isActive
                          ? `${action.activeColor} font-bold`
                          : 'text-white/60 group-hover:text-white/90'
                      }`}>
                        {action.label}
                      </span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${action.color} animate-pulse`}></div>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Safe area padding for modern phones */}
        <div className="h-safe bg-black/90"></div>
      </div>
    </>
  );
}

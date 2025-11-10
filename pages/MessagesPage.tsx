import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';
import { UserProfile } from '../types';
import { PROFILES } from '../constants';

interface Conversation {
  id: string;
  user: UserProfile;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const MessagesPage: React.FC = () => {
  const { user, isLoggedIn } = useUser();
  const { locale } = useLocale();
  const { t } = useTranslations();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load conversations (mock data for now)
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    // Mock conversations - in real app, fetch from Supabase
    const mockConversations: Conversation[] = PROFILES.slice(0, 5).map((profile, index) => ({
      id: `conv-${profile.id}`,
      user: profile,
      lastMessage: index === 0 ? 'Hey! How are you?' : index === 1 ? 'Thanks for the gift! 💝' : 'Nice to meet you!',
      timestamp: new Date(Date.now() - index * 3600000).toISOString(),
      unreadCount: index === 0 ? 2 : index === 2 ? 1 : 0,
      isOnline: index === 0 || index === 3,
    }));

    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 500);
  }, [isLoggedIn]);

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('just_now');
    if (diffMins < 60) return t('minutes_ago', { count: diffMins.toString() });
    if (diffHours < 24) return t('hours_ago', { count: diffHours.toString() });
    if (diffDays < 7) return t('days_ago', { count: diffDays.toString() });

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 aurora-text">{t('login_to_see_messages')}</h2>
        <p className="text-white/70 mb-6 max-w-md">
          {t('messages_login_description')}
        </p>
        <Link
          to={`/${locale}/login`}
          className="px-6 py-3 aurora-gradient rounded-full font-semibold hover:scale-105 transition-transform"
        >
          {t('login_or_sign_up')}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white/70">{t('loading_messages')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black/20 to-black/40">
      {/* Header */}
      <div className="p-6 border-b border-white/10 backdrop-blur-xl bg-black/30">
        <h1 className="text-3xl font-bold aurora-text">{t('messages')}</h1>
        <p className="text-white/60 text-sm mt-1">
          {conversations.length > 0
            ? t('conversations_count', { count: conversations.length.toString() })
            : t('no_conversations_yet')
          }
        </p>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white/40">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('no_messages_yet')}</h3>
            <p className="text-white/60 text-sm mb-6 max-w-sm">
              {t('start_conversation_hint')}
            </p>
            <Link
              to={`/${locale}/`}
              className="px-6 py-2 aurora-gradient rounded-full font-semibold hover:scale-105 transition-transform"
            >
              {t('discover_people')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/${locale}/chat/${conversation.user.id}`}
                className="block p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.user.imageUrl}
                      alt={conversation.user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                    />
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">
                          {conversation.user.name}
                        </h3>
                        {conversation.user.verified && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-white/50 flex-shrink-0">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-white/60'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

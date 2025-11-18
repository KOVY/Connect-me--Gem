import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  actor_id?: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { type, title, message, data, is_read, created_at, actor_id } = notification;
  const [actorProfile, setActorProfile] = useState<any>(null);

  // Load actor profile if actor_id exists
  useEffect(() => {
    if (actor_id && data?.actor_name === undefined) {
      loadActorProfile();
    }
  }, [actor_id]);

  const loadActorProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('user_id', actor_id)
        .single();

      if (error) throw error;
      setActorProfile(profile);
    } catch (error) {
      console.error('[NotificationItem] Failed to load actor profile:', error);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'message': return '💬';
      case 'like': return '❤️';
      case 'like_group': return '❤️';
      case 'match': return '✨';
      case 'gift_received': return '🎁';
      case 'profile_view': return '👀';
      case 'follower': return '⭐';
      case 'boost_activated': return '🔥';
      case 'premium_activated': return '💎';
      case 'story_view': return '👁️';
      case 'story_like': return '❤️';
      case 'comment': return '💭';
      case 'payout_approved': return '💰';
      case 'payout_rejected': return '❌';
      default: return '🔔';
    }
  };

  const getActorName = () => {
    if (data?.actor_name) return data.actor_name;
    if (actorProfile?.name) return actorProfile.name;
    return 'Někdo';
  };

  const getActorAvatar = () => {
    if (data?.actor_avatar) return data.actor_avatar;
    if (actorProfile?.avatar_url) return actorProfile.avatar_url;
    return null;
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: cs
      });
    } catch (error) {
      return 'nedávno';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0 ${
        !is_read ? 'bg-purple-500/10' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar or Icon */}
        <div className="flex-shrink-0">
          {getActorAvatar() ? (
            <div className="relative">
              <img
                src={getActorAvatar()}
                alt={getActorName()}
                className="w-10 h-10 rounded-full border-2 border-purple-500/30 object-cover"
              />
              {/* Icon badge on avatar */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs">
                {getIcon()}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {/* Title/Message */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium line-clamp-2">
                {title || message}
              </p>

              {/* Additional message if title exists */}
              {title && message && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {message}
                </p>
              )}

              {/* Preview text for specific types */}
              {type === 'message' && data?.message_preview && (
                <p className="text-gray-400 text-sm mt-1 truncate italic">
                  "{data.message_preview}"
                </p>
              )}

              {/* Grouped likes actors */}
              {type === 'like_group' && data?.actors && (
                <div className="flex items-center gap-1 mt-2">
                  {data.actors.slice(0, 3).map((actor: any, index: number) => (
                    <img
                      key={index}
                      src={actor.avatar || 'https://via.placeholder.com/32'}
                      alt={actor.name}
                      className="w-6 h-6 rounded-full border border-white/20"
                      title={actor.name}
                    />
                  ))}
                  {data.count > 3 && (
                    <span className="text-xs text-gray-400 ml-1">
                      +{data.count - 3} dalších
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Unread indicator */}
            {!is_read && (
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          {/* Time */}
          <p className="text-gray-500 text-xs mt-1">
            {formatTime(created_at)}
          </p>
        </div>
      </div>
    </button>
  );
}

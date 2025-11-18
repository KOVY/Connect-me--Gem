import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../src/lib/supabase';
import { NotificationDropdown } from './NotificationDropdown';

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

export function NotificationBell() {
  const { isLoggedIn, user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldWiggle, setShouldWiggle] = useState(false);

  // Load unread count on mount
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    loadUnreadCount();
  }, [isLoggedIn, user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Notifications] New notification received:', payload.new);

          // Increment unread count
          setUnreadCount(prev => prev + 1);

          // Add to notifications list if dropdown is open
          if (isOpen) {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          }

          // Trigger wiggle animation
          triggerWiggleAnimation();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Notifications] Notification updated:', payload.new);

          // Update notification in list
          if (isOpen) {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            );
          }

          // Recalculate unread count
          if ((payload.new as Notification).is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, user, isOpen]);

  const loadUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) {
        // If table doesn't exist yet (migration not run), silently fail
        if (error.message?.includes('relation "notifications" does not exist')) {
          console.warn('[Notifications] Table not found - run migration 015');
          return;
        }
        throw error;
      }
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('[Notifications] Failed to load unread count:', error);
    }
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        // If table doesn't exist yet, return empty array
        if (error.message?.includes('relation "notifications" does not exist')) {
          console.warn('[Notifications] Table not found - run migration 015');
          setNotifications([]);
          return;
        }
        throw error;
      }
      setNotifications(data || []);
    } catch (error) {
      console.error('[Notifications] Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerWiggleAnimation = () => {
    setShouldWiggle(true);
    setTimeout(() => setShouldWiggle(false), 500);
  };

  const handleBellClick = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = async () => {
    try {
      // Mark all unread notifications as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setUnreadCount(0);
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative group"
        aria-label="Notifications"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
          <Bell
            className={`w-6 h-6 text-white transition-transform ${
              shouldWiggle ? 'animate-wiggle' : ''
            }`}
          />

          {/* Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </div>
  );
}

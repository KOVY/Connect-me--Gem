import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useTranslations } from '../hooks/useTranslations';
import { supabase } from '../src/lib/supabase';
import { NotificationItem } from './NotificationItem';

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

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export function NotificationDropdown({
  notifications,
  isLoading,
  onClose,
  onMarkAllRead
}: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const { t } = useTranslations();

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if not already
      if (!notification.is_read) {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', notification.id);

        if (error) throw error;
      }

      // Navigate to link if exists
      if (notification.link) {
        navigate(notification.link);
      }

      // Close dropdown
      onClose();
    } catch (error) {
      console.error('[Notifications] Failed to handle notification click:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div className="absolute top-full right-0 mt-2 w-[420px] max-w-[calc(100vw-32px)] z-50 animate-slideDown">
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-bold">{t('notifications') || 'Notifikace'}</h3>
            </div>
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={onMarkAllRead}
                className="text-sm text-purple-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t('mark_all_read') || 'Vše přečteno'}</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm">{t('no_notifications') || 'Žádné notifikace'}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))
            )}
          </div>

          {/* Footer - View All Link */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10 bg-white/5">
              <button
                onClick={() => {
                  navigate(`/${locale}/notifications`);
                  onClose();
                }}
                className="block w-full text-center text-sm text-purple-300 hover:text-white transition-colors"
              >
                {t('view_all_notifications') || 'Zobrazit všechny notifikace'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

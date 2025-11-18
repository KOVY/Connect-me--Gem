import React, { createContext, useContext, useState, useCallback } from 'react';
import { Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'gift' | 'message' | 'like' | 'match' | 'success' | 'error' | 'info';
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  showGiftNotification: (giftName: string, senderName: string, giftIcon: string) => void;
  showMatchNotification: (userName: string, userImage: string) => void;
  showMessageNotification: (senderName: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration (default 5s)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showGiftNotification = useCallback((giftName: string, senderName: string, giftIcon: string) => {
    addNotification({
      type: 'gift',
      title: `${senderName} sent you a gift!`,
      message: `${giftIcon} ${giftName}`,
      duration: 6000,
    });
  }, [addNotification]);

  const showMatchNotification = useCallback((userName: string, userImage: string) => {
    addNotification({
      type: 'match',
      title: `It's a Match! 🎉`,
      message: `You and ${userName} liked each other`,
      duration: 7000,
    });
  }, [addNotification]);

  const showMessageNotification = useCallback((senderName: string, message: string) => {
    addNotification({
      type: 'message',
      title: `New message from ${senderName}`,
      message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      duration: 5000,
    });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showGiftNotification,
        showMatchNotification,
        showMessageNotification,
      }}
    >
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Notification Container Component
function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
}

// Individual Toast Component
function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'gift':
        return 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-purple-400';
      case 'match':
        return 'bg-gradient-to-r from-pink-500/90 to-rose-500/90 border-pink-400';
      case 'message':
        return 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400';
      case 'like':
        return 'bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400';
      case 'success':
        return 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500/90 to-orange-500/90 border-red-400';
      default:
        return 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 border-gray-600';
    }
  };

  const getIcon = () => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case 'gift':
        return <Gift className="w-6 h-6" />;
      case 'match':
        return <span className="text-2xl">💖</span>;
      case 'message':
        return <span className="text-2xl">💬</span>;
      case 'like':
        return <span className="text-2xl">❤️</span>;
      case 'success':
        return <span className="text-2xl">✅</span>;
      case 'error':
        return <span className="text-2xl">❌</span>;
      default:
        return <span className="text-2xl">ℹ️</span>;
    }
  };

  return (
    <div
      className={`
        ${getTypeStyles()}
        backdrop-blur-lg border rounded-2xl shadow-2xl
        p-4 min-w-[320px] max-w-sm
        animate-slide-in-right
        cursor-pointer hover:scale-105 transition-transform
      `}
      onClick={onClose}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm mb-1">{notification.title}</h4>
          <p className="text-white/90 text-sm leading-snug">{notification.message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/40 animate-shrink-width"
          style={{
            animationDuration: `${notification.duration || 5000}ms`,
          }}
        />
      </div>
    </div>
  );
}

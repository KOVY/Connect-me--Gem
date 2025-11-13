/**
 * Push Notifications Service
 * Handles Web Push API for browser notifications
 */

// Check if Push API is supported
export const isPushSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  return permission;
};

// Show a local notification
export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  if (!isPushSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
};

// Subscribe to push notifications
export const subscribeToPush = async (userId: string): Promise<PushSubscription | null> => {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get VAPID public key from environment
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    
    if (!vapidPublicKey) {
      console.error('VAPID public key not configured');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Save subscription to backend
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (userId: string): Promise<boolean> => {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return false;
    }

    await subscription.unsubscribe();

    // Remove subscription from backend
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/remove-push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        userId,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Notification templates
export const NotificationTemplates = {
  newMessage: (senderName: string, message: string) => ({
    title: `New message from ${senderName}`,
    body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'new-message',
    data: {
      type: 'message',
      senderName,
    },
  }),

  newMatch: (matchName: string) => ({
    title: 'New Match! 💖',
    body: `You matched with ${matchName}!`,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'new-match',
    data: {
      type: 'match',
      matchName,
    },
  }),

  cooldownExpired: (profileName: string) => ({
    title: `You can message ${profileName} again! ⏰`,
    body: 'Your cooldown has expired. Send them a message!',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'cooldown-expired',
    data: {
      type: 'cooldown',
      profileName,
    },
  }),

  giftReceived: (senderName: string, giftName: string, giftValue: number) => ({
    title: `${senderName} sent you a gift! 🎁`,
    body: `You received ${giftName} (${giftValue} credits)`,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: 'gift-received',
    data: {
      type: 'gift',
      senderName,
      giftName,
    },
  }),
};

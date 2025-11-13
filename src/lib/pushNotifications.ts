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
    if (import.meta.env.DEV) {
      console.warn('[Push] Not supported in this browser');
    }
    return 'denied';
  }

  const permission = await Notification.requestPermission();

  if (import.meta.env.DEV) {
    console.log('[Push] Permission status:', permission);
  }

  return permission;
};

// Show a local notification
export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  if (!isPushSupported()) {
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(title, {
        icon: '/logo.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        ...options,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Push] Show notification error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }
};

// Subscribe to push notifications
export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Get VAPID public key from environment
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      // Avoid logging config details in production
      if (import.meta.env.DEV) {
        console.warn('[Push] VAPID key not configured');
      }
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Get authenticated session token
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    // Save subscription to backend with auth token
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        subscription,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save subscription: ${response.status}`);
    }

    return subscription;
  } catch (error) {
    // Log error without sensitive details
    if (import.meta.env.DEV) {
      console.error('[Push] Subscription error:', error instanceof Error ? error.message : 'Unknown error');
    }
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (): Promise<boolean> => {
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

    // Get authenticated session token
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    // Remove subscription from backend with auth token
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/remove-push-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove subscription: ${response.status}`);
    }

    return true;
  } catch (error) {
    // Log error without sensitive details
    if (import.meta.env.DEV) {
      console.error('[Push] Unsubscribe error:', error instanceof Error ? error.message : 'Unknown error');
    }
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

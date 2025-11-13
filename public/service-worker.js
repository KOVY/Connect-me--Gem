// Service Worker for Push Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/logo.png',
    badge: '/badge.png',
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/logo.png',
      badge: notificationData.badge || '/badge.png',
      vibrate: [200, 100, 200],
      data: notificationData.data,
      tag: notificationData.tag || 'default',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Get safe navigation target from notification data
  const data = event.notification.data || {};
  const type = data.type;

  // Whitelist of allowed navigation paths
  const allowedPaths = {
    message: '/messages',
    match: '/messages',
    cooldown: '/messages',
    gift: '/profile/inventory',
  };

  // Default to discovery page
  const targetPath = allowedPaths[type] || '/discovery';

  // Ensure path starts with / and doesn't contain external URLs
  const safePath = targetPath.startsWith('/') && !targetPath.includes('://')
    ? targetPath
    : '/discovery';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then(() => client.navigate(safePath));
        }
      }
      // Open new window if not
      if (clients.openWindow) {
        return clients.openWindow(safePath);
      }
    })
  );
});

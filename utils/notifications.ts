// A utility module for handling browser notifications.

/**
 * Checks the current notification permission status.
 * @returns {NotificationPermission} The current permission state ('granted', 'denied', 'default').
 */
export const checkNotificationPermission = (): NotificationPermission => {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        return "denied";
    }
    return Notification.permission;
};

/**
 * Requests permission from the user to show notifications.
 * @returns {Promise<NotificationPermission>} A promise that resolves with the user's choice.
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return "denied";
    }
    const permission = await Notification.requestPermission();
    return permission;
};

/**
 * Shows a local notification if permission has been granted.
 * @param {string} title - The title of the notification.
 * @param {NotificationOptions} options - The options for the notification (e.g., body, icon).
 */
export const showLocalNotification = (title: string, options: NotificationOptions) => {
    if (checkNotificationPermission() === 'granted') {
        new Notification(title, options);
    } else {
        console.log("Notification permission not granted.");
    }
};
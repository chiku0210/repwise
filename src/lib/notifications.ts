/**
 * Browser Notification utilities for Repwise PWA
 */

/**
 * Request notification permission from the user
 * Should be called when user starts their first workout
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  // Already granted or denied
  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Notification permission request failed:', err);
    return 'denied';
  }
}

/**
 * Check if notifications are supported and permitted
 */
export function canSendNotification(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

/**
 * Send a notification
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!canSendNotification()) {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      requireInteraction: false, // Auto-dismiss after a few seconds
      ...options,
    });

    // Auto-close notification after 5 seconds
    setTimeout(() => notification.close(), 5000);

    return notification;
  } catch (err) {
    console.error('Failed to send notification:', err);
    return null;
  }
}

/**
 * Send rest timer complete notification
 */
export function sendRestCompleteNotification(): void {
  sendNotification('Rest Complete! 💪', {
    body: 'Time for your next set',
    tag: 'rest-complete', // Replaces previous rest notifications
  });
}

/**
 * Send workout complete notification
 */
export function sendWorkoutCompleteNotification(workoutName: string): void {
  sendNotification('Workout Complete! 🎉', {
    body: `Great work on ${workoutName}`,
    tag: 'workout-complete',
  });
}

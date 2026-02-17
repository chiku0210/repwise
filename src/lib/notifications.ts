/**
 * Browser Notification utilities for Repwise PWA
 * 
 * DEBUG MODE: Enhanced logging enabled
 */

/**
 * Request notification permission from the user
 * Should be called when user starts their first workout
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  console.log('[NOTIF] requestNotificationPermission() called');
  
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[NOTIF] ❌ Notification API not available');
    return 'denied';
  }

  console.log('[NOTIF] Current permission:', Notification.permission);

  // Already granted or denied
  if (Notification.permission !== 'default') {
    console.log('[NOTIF] Permission already set, returning:', Notification.permission);
    return Notification.permission;
  }

  try {
    console.log('[NOTIF] Requesting permission...');
    const permission = await Notification.requestPermission();
    console.log('[NOTIF] Permission result:', permission);
    return permission;
  } catch (err) {
    console.error('[NOTIF] ❌ Permission request failed:', err);
    return 'denied';
  }
}

/**
 * Check if notifications are supported and permitted
 */
export function canSendNotification(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('[NOTIF] canSend: false (API not available)');
    return false;
  }
  
  const canSend = Notification.permission === 'granted';
  console.log('[NOTIF] canSend:', canSend, '(permission:', Notification.permission + ')');
  return canSend;
}

/**
 * Send a notification
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  console.log('[NOTIF] sendNotification() called');
  console.log('[NOTIF] Title:', title);
  console.log('[NOTIF] Options:', options);
  
  if (!canSendNotification()) {
    console.warn('[NOTIF] ❌ Cannot send notification (permission not granted)');
    return null;
  }

  try {
    console.log('[NOTIF] Creating Notification object...');
    
    const notificationOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      requireInteraction: false,
      ...options,
    };
    
    console.log('[NOTIF] Final options:', notificationOptions);
    
    const notification = new Notification(title, notificationOptions);
    
    console.log('[NOTIF] ✅ Notification object created:', notification);
    console.log('[NOTIF] Notification properties:');
    console.log('  - title:', notification.title);
    console.log('  - body:', notification.body);
    console.log('  - icon:', notification.icon);
    console.log('  - tag:', notification.tag);

    // Event listeners for debugging
    notification.onshow = () => {
      console.log('[NOTIF] 🎉 onshow: Notification is now visible!');
    };
    
    notification.onclick = () => {
      console.log('[NOTIF] 👆 onclick: User clicked notification');
    };
    
    notification.onclose = () => {
      console.log('[NOTIF] 🚪 onclose: Notification closed');
    };
    
    notification.onerror = (err) => {
      console.error('[NOTIF] ❌ onerror: Notification error:', err);
    };

    // Auto-close notification after 5 seconds
    setTimeout(() => {
      console.log('[NOTIF] Auto-closing notification after 5 seconds');
      notification.close();
    }, 5000);

    return notification;
  } catch (err) {
    console.error('[NOTIF] ❌ Failed to create notification:', err);
    console.error('[NOTIF] Error details:', {
      name: (err as Error).name,
      message: (err as Error).message,
      stack: (err as Error).stack,
    });
    return null;
  }
}

/**
 * Send rest timer complete notification
 */
export function sendRestCompleteNotification(): void {
  console.log('[NOTIF] sendRestCompleteNotification() called');
  const result = sendNotification('Rest Complete! 💪', {
    body: 'Time for your next set',
    tag: 'rest-complete', // Replaces previous rest notifications
  });
  
  if (result) {
    console.log('[NOTIF] ✅ Rest notification sent successfully');
  } else {
    console.warn('[NOTIF] ❌ Rest notification failed to send');
  }
}

/**
 * Send workout complete notification
 */
export function sendWorkoutCompleteNotification(workoutName: string): void {
  console.log('[NOTIF] sendWorkoutCompleteNotification() called for:', workoutName);
  const result = sendNotification('Workout Complete! 🎉', {
    body: `Great work on ${workoutName}`,
    tag: 'workout-complete',
  });
  
  if (result) {
    console.log('[NOTIF] ✅ Workout notification sent successfully');
  } else {
    console.warn('[NOTIF] ❌ Workout notification failed to send');
  }
}

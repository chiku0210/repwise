'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Footer } from '@/components/landing/Footer';
import { AuthGate } from '@/components/AuthGate';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';
import { RecentWorkouts } from '@/components/dashboard/RecentWorkouts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { 
  requestNotificationPermission, 
  sendRestCompleteNotification,
  canSendNotification 
} from '@/lib/notifications';

export default function DashboardPage() {
  const [notifStatus, setNotifStatus] = useState<string>('');
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied'
  );
  const [countdown, setCountdown] = useState<number>(0);

  const handleRequestPermission = async () => {
    setNotifStatus('Requesting permission...');
    
    try {
      const permission = await requestNotificationPermission();
      setPermissionState(permission);
      
      if (permission === 'granted') {
        setNotifStatus('✅ Permission granted!');
      } else if (permission === 'denied') {
        setNotifStatus('❌ Permission denied');
      } else {
        setNotifStatus('⚠️ Permission dismissed');
      }
    } catch (err: any) {
      setNotifStatus(`❌ Error: ${err.message}`);
      console.error('Permission request error:', err);
    }
  };

  const handleSendTestNotification = () => {
    if (!canSendNotification()) {
      setNotifStatus('❌ Cannot send: Permission not granted');
      return;
    }

    // Start countdown
    setNotifStatus('⏱️ Notification will send in 5 seconds... MINIMIZE YOUR BROWSER NOW!');
    setCountdown(5);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Send notification after 5 seconds
    setTimeout(() => {
      try {
        sendRestCompleteNotification();
        setNotifStatus('✅ Notification sent! Check your screen (if minimized) or notification center.');
        setCountdown(0);
      } catch (err: any) {
        setNotifStatus(`❌ Send failed: ${err.message}`);
        console.error('Send notification error:', err);
        setCountdown(0);
      }
    }, 5000);
  };

  const handleTestAll = async () => {
    setNotifStatus('Running full test...');
    
    try {
      // Step 1: Check API availability
      if (typeof window === 'undefined' || !('Notification' in window)) {
        setNotifStatus('❌ Notification API not supported');
        return;
      }
      
      // Step 2: Request permission
      const permission = await requestNotificationPermission();
      setPermissionState(permission);
      
      if (permission !== 'granted') {
        setNotifStatus(`❌ Permission ${permission}`);
        return;
      }
      
      // Step 3: Countdown before sending
      setNotifStatus('⏱️ Permission granted! Notification will send in 5 seconds... MINIMIZE NOW!');
      setCountdown(5);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Send after 5 seconds
      setTimeout(() => {
        sendRestCompleteNotification();
        setNotifStatus('✅ Full test complete! Check your notifications.');
        setCountdown(0);
      }, 5000);
      
    } catch (err: any) {
      setNotifStatus(`❌ Test failed: ${err.message}`);
      console.error('Full test error:', err);
      setCountdown(0);
    }
  };

  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col bg-[#0a1628]">
        <main className="flex-1 pb-24">
          <div className="mx-auto max-w-2xl space-y-6 p-6">
            <WelcomeHeader />
            
            {/* DEBUG: Notification Testing Panel */}
            <div className="rounded-xl border-2 border-yellow-600/50 bg-yellow-900/10 p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-400">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold">🧪 Notification Testing (DEBUG)</h3>
              </div>
              
              {/* Current Status */}
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  <strong>Browser Support:</strong>{' '}
                  {typeof window !== 'undefined' && 'Notification' in window ? '✅ Supported' : '❌ Not Supported'}
                </p>
                <p className="text-gray-300">
                  <strong>Permission:</strong>{' '}
                  <span className={`font-semibold ${
                    permissionState === 'granted' ? 'text-green-400' :
                    permissionState === 'denied' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {permissionState}
                  </span>
                </p>
                <p className="text-gray-300">
                  <strong>Can Send:</strong>{' '}
                  {typeof window !== 'undefined' && canSendNotification() ? '✅ Yes' : '❌ No'}
                </p>
              </div>

              {/* Countdown Display */}
              {countdown > 0 && (
                <div className="bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4 text-center animate-pulse">
                  <div className="text-4xl font-bold text-orange-400 mb-2">{countdown}</div>
                  <p className="text-sm text-orange-300 font-semibold">⚡ MINIMIZE YOUR BROWSER NOW! ⚡</p>
                </div>
              )}

              {/* Status Message */}
              {notifStatus && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
                  {notifStatus}
                </div>
              )}

              {/* Test Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handleTestAll}
                  disabled={countdown > 0}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Run Full Test (5s delay)
                </button>
                
                <button
                  onClick={handleRequestPermission}
                  disabled={countdown > 0}
                  className="bg-blue-600/20 border border-blue-600 text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔔 Request Permission Only
                </button>
                
                <button
                  onClick={handleSendTestNotification}
                  disabled={permissionState !== 'granted' || countdown > 0}
                  className="bg-green-600/20 border border-green-600 text-green-400 font-semibold py-2 px-4 rounded-lg hover:bg-green-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-500"
                >
                  ✅ Send Test Notification (5s delay)
                </button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-400 border-t border-yellow-700/30 pt-3">
                <p className="font-semibold mb-1 text-orange-400">🎯 NEW: 5-Second Countdown!</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click "✅ Send Test Notification"</li>
                  <li>You have 5 seconds - MINIMIZE your browser</li>
                  <li>Watch for notification on your screen</li>
                  <li>If you see it pop up = notifications work! 🎉</li>
                </ol>
                <p className="mt-2 text-yellow-300">💡 Tip: On Mac use Cmd+M, on Windows use Windows+D</p>
              </div>
            </div>

            <QuickActions />
            <WeeklyStats />
            <RecentWorkouts />
          </div>
        </main>

        <Footer variant="app" />
        <BottomNav />
      </div>
    </AuthGate>
  );
}

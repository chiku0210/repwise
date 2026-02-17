'use client';

import { useState, useEffect } from 'react';
import { Bell, Copy } from 'lucide-react';
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
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Capture console.log calls
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('[NOTIF]')) {
        setConsoleLogs(prev => [...prev, `LOG: ${message}`]);
      }
      originalLog(...args);
    };

    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('[NOTIF]')) {
        setConsoleLogs(prev => [...prev, `WARN: ${message}`]);
      }
      originalWarn(...args);
    };

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('[NOTIF]')) {
        setConsoleLogs(prev => [...prev, `ERROR: ${message}`]);
      }
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const handleRequestPermission = async () => {
    setNotifStatus('Requesting permission...');
    setConsoleLogs([]);
    
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
      console.error('[NOTIF] Permission request error:', err);
    }
  };

  const handleSendTestNotification = () => {
    setNotifStatus('Attempting to send notification...');
    setConsoleLogs([]);
    
    try {
      if (!canSendNotification()) {
        setNotifStatus('❌ Cannot send: Permission not granted');
        return;
      }

      sendRestCompleteNotification();
      setNotifStatus('✅ sendRestCompleteNotification() executed! Check console logs below.');
    } catch (err: any) {
      setNotifStatus(`❌ Send failed: ${err.message}`);
      console.error('[NOTIF] Send notification error:', err);
    }
  };

  const handleTestAll = async () => {
    setNotifStatus('Running full test...');
    setConsoleLogs([]);
    
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
      
      // Step 3: Send test notification
      setNotifStatus('Permission granted, sending test...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      sendRestCompleteNotification();
      setNotifStatus('✅ Full test complete! Check console logs and notifications.');
      
    } catch (err: any) {
      setNotifStatus(`❌ Test failed: ${err.message}`);
      console.error('[NOTIF] Full test error:', err);
    }
  };

  const copyLogsToClipboard = () => {
    const logsText = consoleLogs.join('\n');
    navigator.clipboard.writeText(logsText);
    setNotifStatus('📋 Logs copied to clipboard!');
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
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all"
                >
                  🚀 Run Full Test (Request + Send)
                </button>
                
                <button
                  onClick={handleRequestPermission}
                  className="bg-blue-600/20 border border-blue-600 text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600/30 transition-all"
                >
                  🔔 Request Permission Only
                </button>
                
                <button
                  onClick={handleSendTestNotification}
                  disabled={permissionState !== 'granted'}
                  className="bg-green-600/20 border border-green-600 text-green-400 font-semibold py-2 px-4 rounded-lg hover:bg-green-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-500"
                >
                  ✅ Send Test Notification
                </button>
              </div>

              {/* Console Logs */}
              {consoleLogs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-yellow-400">📋 Console Logs:</h4>
                    <button
                      onClick={copyLogsToClipboard}
                      className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-black/40 border border-gray-700 rounded-lg p-3 max-h-64 overflow-y-auto text-xs font-mono">
                    {consoleLogs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`py-1 ${
                          log.startsWith('ERROR:') ? 'text-red-400' :
                          log.startsWith('WARN:') ? 'text-yellow-400' :
                          'text-green-400'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="text-xs text-gray-400 border-t border-yellow-700/30 pt-3">
                <p className="font-semibold mb-1">🔍 Debugging Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click "✅ Send Test Notification" button</li>
                  <li>Read console logs above - look for "onshow" event</li>
                  <li>Check system notification settings (OS level)</li>
                  <li>Check browser notification settings</li>
                  <li>Try closing/minimizing browser and re-sending</li>
                </ol>
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

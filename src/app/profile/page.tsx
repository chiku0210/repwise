'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { AuthGate } from '@/components/AuthGate';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>

          {/* User Info Card */}
          <div className="rounded-lg bg-[#0f1e33] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">Account Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <p className="text-white">{user?.email || 'Loading...'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">User ID</label>
                <p className="text-xs break-all text-gray-500">{user?.id || 'Loading...'}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Member since</label>
                <p className="text-sm text-gray-300">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Settings placeholder */}
          <div className="rounded-lg bg-[#0f1e33] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">Settings</h2>
            <p className="text-sm text-gray-400">App settings coming soon...</p>
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            size="lg"
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

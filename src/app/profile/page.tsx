'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { AuthGate } from '@/components/AuthGate';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { useRouter } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsCard } from '@/components/profile/StatsCard';
import { SettingsSection, SettingItem } from '@/components/profile/SettingsSection';
import { User, Dumbbell, Settings, LogOut, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { stats, loading: statsLoading } = useWorkoutStats(user?.id);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const loading = authLoading || profileLoading || statsLoading;

  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              <p className="text-sm text-gray-400">Track your progress</p>
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Profile Header with Stats */}
              <ProfileHeader email={user?.email || ''} profile={profile} stats={stats} createdAt={profile?.created_at || ''} />

              {/* Stats Overview Card */}
              <StatsCard profile={profile} stats={stats} />

              {/* Favorite Exercises */}
              {stats.favorite_exercises.length > 0 && (
                <div className="rounded-lg bg-[#0f1e33] p-6 shadow-lg">
                  <h2 className="mb-4 text-lg font-semibold text-white">Favorite Exercises</h2>
                  <div className="space-y-3">
                    {stats.favorite_exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-0"
                      >
                        <span className="text-sm text-gray-300">{exercise.exercise_name}</span>
                        <span className="text-xs text-gray-500">{exercise.count} times</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fitness Profile */}
              {profile && (
                <SettingsSection
                  title="Fitness Profile"
                  icon={<Dumbbell className="h-5 w-5 text-blue-500" />}
                  defaultOpen
                >
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-400">Experience Level</span>
                      <span className="text-sm text-white capitalize">
                        {profile.experience_level}
                      </span>
                    </div>
                    {profile.primary_goal && (
                      <div className="flex justify-between border-t border-gray-700 py-2">
                        <span className="text-sm text-gray-400">Primary Goal</span>
                        <span className="text-sm text-white capitalize">
                          {profile.primary_goal.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-700 py-2">
                      <span className="text-sm text-gray-400">Training Frequency</span>
                      <span className="text-sm text-white">
                        {profile.training_frequency} days/week
                      </span>
                    </div>
                    {profile.preferred_split && (
                      <div className="flex justify-between border-t border-gray-700 py-2">
                        <span className="text-sm text-gray-400">Preferred Split</span>
                        <span className="text-sm text-white uppercase">
                          {profile.preferred_split.replace('_', '/')}
                        </span>
                      </div>
                    )}
                  </div>
                </SettingsSection>
              )}

              {/* Account Settings */}
              <SettingsSection title="Account" icon={<User className="h-5 w-5 text-gray-500" />}>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-400">Email</span>
                    <span className="text-sm text-white">{user?.email}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 py-2">
                    <span className="text-sm text-gray-400">User ID</span>
                    <span className="text-xs text-gray-500">{user?.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 py-2">
                    <span className="text-sm text-gray-400">Member since</span>
                    <span className="text-sm text-gray-300">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </SettingsSection>

              {/* App Settings */}
              <SettingsSection
                title="Settings"
                icon={<Settings className="h-5 w-5 text-gray-500" />}
              >
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-400">Weight Unit</span>
                    <span className="text-sm text-white uppercase">
                      {profile?.weight_unit || 'kg'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 py-2">
                    <span className="text-sm text-gray-400">Height Unit</span>
                    <span className="text-sm text-white uppercase">
                      {profile?.height_unit || 'cm'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 py-2">
                    <span className="text-sm text-gray-400">Notifications</span>
                    <span className="text-sm text-white">
                      {profile?.notifications_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </SettingsSection>

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                disabled={authLoading}
                className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                size="lg"
              >
                {authLoading ? (
                  'Signing out...'
                ) : (
                  <>
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        <BottomNav />
        <footer className="pt-8 pb-24 text-center text-xs text-gray-500">
          <p>Repwise v1.0.0</p>
          <p className="mt-1">Built with Next.js + Supabase</p>
        </footer>
      </main>
    </AuthGate>
  );
}

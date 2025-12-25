'use client';

import type { UserProfile, WorkoutStats } from '@/lib/types/profile';

interface ProfileHeaderProps {
  email: string;
  profile: UserProfile | null;
  stats: WorkoutStats;
}

export function ProfileHeader({ email, profile, stats }: ProfileHeaderProps) {
  const displayName = profile?.name || email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Workouts" value={stats.total_workouts} />
        <StatCard label="Streak" value={`${stats.current_streak}d`} />
        <StatCard label="Days Active" value={stats.days_active} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#0f1e33] p-3 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

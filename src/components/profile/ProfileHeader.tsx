'use client';

import type { UserProfile, WorkoutStats } from '@/lib/types/profile';
import { getInitials } from '@/lib/profile-utils';

interface ProfileHeaderProps {
  email: string;
  profile: UserProfile | null;
  stats: WorkoutStats;
}

export function ProfileHeader({ email, profile, stats }: ProfileHeaderProps) {
  const displayName = profile?.name || email.split('@')[0];
  const initials = getInitials(displayName);
  const hasAvatar = !!profile?.avatar_url;

  return (
    <div className="space-y-4">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        {hasAvatar ? (
          // Google OAuth avatar
          <img
            src={profile.avatar_url!}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          // Fallback initials
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white ring-2 ring-blue-500">
            {initials}
          </div>
        )}
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

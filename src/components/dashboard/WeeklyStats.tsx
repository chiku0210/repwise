'use client';

import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import { TrendingUp, Dumbbell, Zap } from 'lucide-react';

export function WeeklyStats() {
  const { stats, isLoading } = useWorkoutStats();

  const statCards = [
    {
      label: 'Workouts',
      value: isLoading ? '...' : stats?.totalWorkouts || 0,
      icon: Dumbbell,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Sets',
      value: isLoading ? '...' : stats?.totalSets || 0,
      icon: Zap,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Volume (kg)',
      value: isLoading ? '...' : stats?.totalVolume?.toLocaleString() || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">This Week</h2>
      <div className="grid grid-cols-3 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-800 bg-[#0f1e33] p-4 text-center"
            >
              <div className={`mx-auto mb-2 inline-flex rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                <Icon className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <p className="text-xl font-bold text-white md:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

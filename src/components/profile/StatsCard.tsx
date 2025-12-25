'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, Plus } from 'lucide-react';
import type { UserProfile, WorkoutStats } from '@/lib/types/profile';

interface StatsCardProps {
  profile: UserProfile | null;
  stats: WorkoutStats;
}

export function StatsCard({ profile, stats }: StatsCardProps) {
  const router = useRouter();
  const currentWeight = profile?.current_weight_kg;
  const targetWeight = profile?.target_weight_kg;
  const weightUnit = profile?.weight_unit || 'kg';
  const hasHeight = !!profile?.height_cm;

  // Empty state: No weight or height data
  const isEmpty = !currentWeight && !hasHeight;

  const displayWeight = (kg: number | null | undefined) => {
    if (!kg) return null;
    if (weightUnit === 'lbs') {
      return (kg * 2.20462).toFixed(1);
    }
    return kg.toFixed(1);
  };

  const calculateBMI = () => {
    if (!currentWeight || !profile?.height_cm) return null;
    const heightM = profile.height_cm / 100;
    return (currentWeight / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  // Empty State CTA
  if (isEmpty) {
    return (
      <div className="space-y-6 rounded-lg bg-[#0f1e33] p-8 text-center shadow-lg">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-600/20 p-4">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Complete Your Profile</h3>
          <p className="mx-auto max-w-sm text-sm text-gray-400">
            Add your body stats to track progress, calculate BMI, and unlock personalized
            insights!
          </p>
        </div>

        <button
          onClick={() => router.push('/profile/edit')}
          className="mx-auto flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Body Stats
        </button>
      </div>
    );
  }

  // Regular Stats Display
  return (
    <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white">Your Stats</h2>

      {/* Current Weight */}
      {currentWeight && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Weight</span>
            <span className="text-xl font-bold text-white">
              {displayWeight(currentWeight)} {weightUnit}
            </span>
          </div>

          {/* Target Weight */}
          {targetWeight && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Target Weight</span>
              <span className="text-lg text-gray-300">
                {displayWeight(targetWeight)} {weightUnit}
              </span>
            </div>
          )}
        </div>
      )}

      {/* BMI */}
      {bmi && (
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <span className="text-sm text-gray-400">BMI</span>
          <div className="text-right">
            <span className="text-xl font-bold text-white">{bmi}</span>
            <span className={`ml-2 text-sm ${bmiCategory?.color}`}>{bmiCategory?.label}</span>
          </div>
        </div>
      )}

      {/* Total Volume */}
      {stats.total_volume_kg > 0 && (
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <span className="text-sm text-gray-400">Total Volume Lifted</span>
          <span className="text-lg font-semibold text-white">
            {stats.total_volume_kg.toLocaleString()} kg
          </span>
        </div>
      )}

      {/* Last Workout */}
      {stats.last_workout_date && (
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <span className="text-sm text-gray-400">Last Workout</span>
          <span className="text-sm text-gray-300">
            {new Date(stats.last_workout_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}
    </div>
  );
}

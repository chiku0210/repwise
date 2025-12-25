'use client';

import type { UserProfile, WorkoutStats } from '@/lib/types/profile';

interface StatsCardProps {
  profile: UserProfile | null;
  stats: WorkoutStats;
}

export function StatsCard({ profile, stats }: StatsCardProps) {
  const currentWeight = profile?.current_weight_kg;
  const targetWeight = profile?.target_weight_kg;
  const weightUnit = profile?.weight_unit || 'kg';

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

  const progressPercentage =
    currentWeight && targetWeight && targetWeight < currentWeight
      ? Math.min(100, ((currentWeight - targetWeight) / (currentWeight - targetWeight)) * 100)
      : 0;

  return (
    <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white">Your Stats</h2>

      {/* Weight Progress */}
      {currentWeight && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Weight</span>
            <span className="text-xl font-bold text-white">
              {displayWeight(currentWeight)} {weightUnit}
            </span>
          </div>
          {targetWeight && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Target Weight</span>
                <span className="text-lg text-gray-300">
                  {displayWeight(targetWeight)} {weightUnit}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* BMI */}
      {bmi && (
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          <span className="text-sm text-gray-400">BMI</span>
          <div className="text-right">
            <span className="text-xl font-bold text-white">{bmi}</span>
            <span className={`ml-2 text-sm ${bmiCategory?.color}`}>
              {bmiCategory?.label}
            </span>
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

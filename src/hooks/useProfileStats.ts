'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { WorkoutStats } from '@/lib/types/profile';

/**
 * Hook for fetching comprehensive workout statistics for user profile page
 * Returns all-time stats including total workouts, streak, volume, and favorite exercises
 */
export function useProfileStats(userId: string | undefined) {
  const [stats, setStats] = useState<WorkoutStats>({
    total_workouts: 0,
    current_streak: 0,
    days_active: 0,
    total_volume_kg: 0,
    favorite_exercises: [],
    last_workout_date: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const supabase = getSupabaseBrowserClient();

        // Get total workouts
        const { count: totalWorkouts } = await supabase
          .from('workout_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .not('completed_at', 'is', null);

        // Get total volume
        const { data: sessions } = await supabase
          .from('workout_sessions')
          .select('total_volume_kg')
          .eq('user_id', userId)
          .not('completed_at', 'is', null);

        const totalVolume = sessions?.reduce((sum, s) => sum + (s.total_volume_kg || 0), 0) || 0;

        // Get last workout date
        const { data: lastWorkout } = await supabase
          .from('workout_sessions')
          .select('completed_at')
          .eq('user_id', userId)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        // Calculate streak
        const streak = lastWorkout ? await calculateStreak(userId) : 0;

        // Get unique workout days
        const { data: workoutDays } = await supabase
          .from('workout_sessions')
          .select('completed_at')
          .eq('user_id', userId)
          .not('completed_at', 'is', null);

        const uniqueDays = new Set(
          workoutDays?.map((w) => new Date(w.completed_at!).toDateString())
        ).size;

        // Get favorite exercises (top 3)
        const { data: exercises } = await supabase
          .from('workout_exercises')
          .select(`
            exercise_id,
            exercises (name)
          `)
          .eq('workout_sessions.user_id', userId);

        const exerciseCounts = exercises?.reduce((acc: Record<string, number>, ex: any) => {
          const name = ex.exercises?.name;
          if (name) acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});

        const favorites = Object.entries(exerciseCounts || {})
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([exercise_name, count]) => ({ exercise_name, count: count as number }));

        setStats({
          total_workouts: totalWorkouts || 0,
          current_streak: streak,
          days_active: uniqueDays,
          total_volume_kg: totalVolume,
          favorite_exercises: favorites,
          last_workout_date: lastWorkout?.completed_at || null,
        });
      } catch (err) {
        // Silent error - stats remain at default values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading };
}

async function calculateStreak(userId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient();
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select('completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false });

  if (!workouts || workouts.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < workouts.length; i++) {
    const workoutDate = new Date(workouts[i].completed_at!);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
}

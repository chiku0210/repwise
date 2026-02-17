'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { startOfWeek, endOfWeek } from 'date-fns';

interface WeeklyStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
}

export function useWorkoutStats() {
  const [stats, setStats] = useState<WeeklyStats>({
    totalWorkouts: 0,
    totalSets: 0,
    totalVolume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      if (typeof window === 'undefined') return;

      try {
        const supabase = getSupabaseBrowserClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Calculate this week's date range (Monday to Sunday)
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

        // Fetch this week's completed workouts
        const { data: workouts, error } = await supabase
          .from('workout_sessions')
          .select('total_sets, total_volume_kg')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .gte('completed_at', weekStart.toISOString())
          .lte('completed_at', weekEnd.toISOString());

        if (error) throw error;

        // Calculate totals
        const totalWorkouts = workouts?.length || 0;
        const totalSets = workouts?.reduce((sum, w) => sum + (w.total_sets || 0), 0) || 0;
        const totalVolume = workouts?.reduce((sum, w) => sum + (Number(w.total_volume_kg) || 0), 0) || 0;

        setStats({
          totalWorkouts,
          totalSets,
          totalVolume: Math.round(totalVolume),
        });
      } catch (error) {
        // Silent error - stats remain at 0
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyStats();
  }, []);

  return { stats, isLoading };
}

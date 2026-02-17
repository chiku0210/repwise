'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ChevronRight, Dumbbell } from 'lucide-react';

interface WorkoutSession {
  id: string;
  started_at: string;
  finished_at: string | null;
  duration_minutes: number | null;
  template_id: string | null;
  templates?: {
    name: string;
  } | null;
}

export function RecentWorkouts() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            id,
            started_at,
            finished_at,
            duration_minutes,
            template_id,
            templates:template_id (
              name
            )
          `)
          .eq('status', 'completed')
          .order('started_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setWorkouts(data || []);
      } catch (error) {
        console.error('Error fetching recent workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentWorkouts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Recent Workouts</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-[#0f1e33]" />
          ))}
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Recent Workouts</h2>
        <div className="rounded-xl border border-gray-800 bg-[#0f1e33] p-8 text-center">
          <div className="mx-auto mb-3 inline-flex rounded-full bg-blue-500/10 p-3">
            <Dumbbell className="h-8 w-8 text-blue-400" strokeWidth={2} />
          </div>
          <p className="mb-1 font-semibold text-white">No workouts yet</p>
          <p className="text-sm text-gray-400">
            Start your first workout to see it here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Workouts</h2>
        <button
          onClick={() => router.push('/log')}
          className="text-sm text-blue-400 transition-colors hover:text-blue-300"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {workouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => router.push(`/log?session=${workout.id}`)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-800 bg-[#0f1e33] p-4 text-left transition-all hover:border-blue-600/50 hover:bg-[#0f1e33]/80"
          >
            <div className="flex-1">
              <p className="font-medium text-white">
                {workout.templates?.name || 'Workout'}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {workout.duration_minutes ? `${workout.duration_minutes} min` : 'N/A'}
                </span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(workout.started_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { calculateDuration } from '@/lib/utils';
import WorkoutCard from '@/components/workout-card';
import EmptyWorkoutState from '@/components/empty-workout-state';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Loader2, AlertCircle } from 'lucide-react';

// Constants
const WORKOUTS_PER_PAGE = 10;

// Final transformed workout interface
interface WorkoutWithDetails {
  id: string;
  workout_name: string;
  started_at: string;
  completed_at: string;
  duration: number;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
  exercises: {
    name: string;
    equipment_type: string;
    sets: {
      set_number: number;
      weight_kg: number;
      reps: number;
      rpe: number;
    }[];
  }[];
}

// Supabase response types (matching actual DB relationships)
type SupabaseExerciseSet = {
  id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number;
  timestamp: string;
};

type SupabaseWorkoutExercise = {
  id: string;
  order_index: number;
  exercises: {
    id: string;
    name: string;
    equipment_type: string;
  };
  exercise_sets: SupabaseExerciseSet[];
};

type SupabaseWorkoutSession = {
  id: string;
  workout_name: string;
  started_at: string;
  completed_at: string;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
  workout_exercises: SupabaseWorkoutExercise[];
};

export default function LogPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Transform raw Supabase data to WorkoutWithDetails format
  const transformWorkoutData = (session: SupabaseWorkoutSession): WorkoutWithDetails => {
    const exercises = session.workout_exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map((workoutEx) => ({
        name: workoutEx.exercises.name,
        equipment_type: workoutEx.exercises.equipment_type,
        sets: workoutEx.exercise_sets
          .sort((a, b) => a.set_number - b.set_number)
          .map((set) => ({
            set_number: set.set_number,
            weight_kg: set.weight_kg,
            reps: set.reps,
            rpe: set.rpe,
          })),
      }));

    return {
      id: session.id,
      workout_name: session.workout_name,
      started_at: session.started_at,
      completed_at: session.completed_at,
      duration: calculateDuration(session.started_at, session.completed_at),
      total_sets: session.total_sets,
      total_reps: session.total_reps,
      total_volume_kg: session.total_volume_kg,
      exercises,
    };
  };

  // Fetch workouts from Supabase
  const fetchWorkouts = async (pageNum: number) => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to view workout history');
        setLoading(false);
        return;
      }

      const startRange = pageNum * WORKOUTS_PER_PAGE;
      const endRange = (pageNum + 1) * WORKOUTS_PER_PAGE - 1;

      const { data: sessions, error: fetchError } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          workout_name,
          started_at,
          completed_at,
          total_sets,
          total_reps,
          total_volume_kg,
          workout_exercises (
            id,
            order_index,
            exercises (
              id,
              name,
              equipment_type
            ),
            exercise_sets (
              id,
              set_number,
              weight_kg,
              reps,
              rpe,
              timestamp
            )
          )
        `)
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .range(startRange, endRange)
        .returns<SupabaseWorkoutSession[]>();

      if (fetchError) throw fetchError;

      // Transform data
      const transformedWorkouts = (sessions || []).map(transformWorkoutData);

      // Check if there are more workouts to load
      if (transformedWorkouts.length < WORKOUTS_PER_PAGE) {
        setHasMore(false);
      }

      // Append to existing workouts or set initial workouts
      if (pageNum === 0) {
        setWorkouts(transformedWorkouts);
      } else {
        setWorkouts((prev) => [...prev, ...transformedWorkouts]);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workout history. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWorkouts(0);
  }, []);

  // Load more handler
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWorkouts(nextPage);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-4">
        <div className="mx-auto max-w-2xl pt-20">
          <div className="rounded-lg bg-red-900/20 border border-red-800 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 mb-1">Error Loading Workouts</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-[#0f1c2e]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Workout Log</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pb-24">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {workouts.length === 0 ? (
            <EmptyWorkoutState />
          ) : (
            <>
              {/* Workout List */}
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-700 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}

              {/* End of List Message */}
              {!hasMore && workouts.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500">
                  You've reached the end of your workout history
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

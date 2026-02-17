'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { calculateDuration } from '@/lib/utils';
import WorkoutCard from '@/components/workout-card';
import IncompleteWorkoutCard from '@/components/incomplete-workout-card';
import EmptyWorkoutState from '@/components/empty-workout-state';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Loader2, AlertCircle, ChevronDown } from 'lucide-react';

// Constants
const INCOMPLETE_INITIAL_LIMIT = 2;
const INCOMPLETE_LOAD_MORE = 5;
const COMPLETED_PER_PAGE = 10;

// Workout interfaces
interface IncompleteWorkout {
  id: string;
  workout_name: string;
  started_at: string;
  total_sets: number;
  total_volume_kg: number;
  exercises: {
    name: string;
  }[];
}

interface CompletedWorkout {
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

// Supabase response types
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
  completed_at: string | null;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
  workout_exercises: SupabaseWorkoutExercise[];
};

export default function LogPage() {
  // Incomplete workouts state
  const [incompleteWorkouts, setIncompleteWorkouts] = useState<IncompleteWorkout[]>([]);
  const [incompleteLimit, setIncompleteLimit] = useState(INCOMPLETE_INITIAL_LIMIT);
  const [incompleteTotal, setIncompleteTotal] = useState(0);
  const [loadingIncomplete, setLoadingIncomplete] = useState(true);

  // Completed workouts state
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [completedPage, setCompletedPage] = useState(0);
  const [hasMoreCompleted, setHasMoreCompleted] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [loadingMoreCompleted, setLoadingMoreCompleted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Transform incomplete workout data
  const transformIncompleteWorkout = (session: SupabaseWorkoutSession): IncompleteWorkout => {
    return {
      id: session.id,
      workout_name: session.workout_name,
      started_at: session.started_at,
      total_sets: session.total_sets || 0,
      total_volume_kg: session.total_volume_kg || 0,
      exercises: session.workout_exercises
        .sort((a, b) => a.order_index - b.order_index)
        .map((ex) => ({ name: ex.exercises.name })),
    };
  };

  // Transform completed workout data
  const transformCompletedWorkout = (session: SupabaseWorkoutSession): CompletedWorkout => {
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
      completed_at: session.completed_at!,
      duration: calculateDuration(session.started_at, session.completed_at!),
      total_sets: session.total_sets,
      total_reps: session.total_reps,
      total_volume_kg: session.total_volume_kg,
      exercises,
    };
  };

  // Fetch incomplete workouts
  const fetchIncompleteWorkouts = async (limit: number) => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to view workout history');
        return;
      }

      // Get total count
      const { count } = await supabase
        .from('workout_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('completed_at', null);

      setIncompleteTotal(count || 0);

      // Fetch incomplete workouts
      const { data: sessions, error: fetchError } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          workout_name,
          started_at,
          total_sets,
          total_volume_kg,
          workout_exercises (
            id,
            order_index,
            exercises (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(limit)
        .returns<SupabaseWorkoutSession[]>();

      if (fetchError) throw fetchError;

      const transformed = (sessions || []).map(transformIncompleteWorkout);
      setIncompleteWorkouts(transformed);
    } catch (err) {
      console.error('Error fetching incomplete workouts:', err);
      setError('Failed to load incomplete workouts.');
    } finally {
      setLoadingIncomplete(false);
    }
  };

  // Fetch completed workouts
  const fetchCompletedWorkouts = async (pageNum: number) => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const startRange = pageNum * COMPLETED_PER_PAGE;
      const endRange = (pageNum + 1) * COMPLETED_PER_PAGE - 1;

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

      const transformed = (sessions || []).map(transformCompletedWorkout);

      if (transformed.length < COMPLETED_PER_PAGE) {
        setHasMoreCompleted(false);
      }

      if (pageNum === 0) {
        setCompletedWorkouts(transformed);
      } else {
        setCompletedWorkouts((prev) => [...prev, ...transformed]);
      }
    } catch (err) {
      console.error('Error fetching completed workouts:', err);
      setError('Failed to load completed workouts.');
    } finally {
      setLoadingCompleted(false);
      setLoadingMoreCompleted(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchIncompleteWorkouts(INCOMPLETE_INITIAL_LIMIT);
    fetchCompletedWorkouts(0);
  }, []);

  // Load more incomplete
  const handleLoadMoreIncomplete = () => {
    const newLimit = incompleteLimit + INCOMPLETE_LOAD_MORE;
    setIncompleteLimit(newLimit);
    fetchIncompleteWorkouts(newLimit);
  };

  // Load more completed
  const handleLoadMoreCompleted = () => {
    if (loadingMoreCompleted || !hasMoreCompleted) return;
    setLoadingMoreCompleted(true);
    const nextPage = completedPage + 1;
    setCompletedPage(nextPage);
    fetchCompletedWorkouts(nextPage);
  };

  const loading = loadingIncomplete || loadingCompleted;
  const hasIncomplete = incompleteWorkouts.length > 0;
  const hasCompleted = completedWorkouts.length > 0;
  const showIncompleteShowMore = incompleteWorkouts.length < incompleteTotal;

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : error ? (
          <div className="mx-auto max-w-2xl px-4 pt-20">
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
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-6">
            {/* Incomplete Workouts Section */}
            {hasIncomplete && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-white">Unfinished Workouts</h2>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-400">
                    {incompleteTotal}
                  </span>
                </div>
                <div className="space-y-3">
                  {incompleteWorkouts.map((workout) => (
                    <IncompleteWorkoutCard key={workout.id} workout={workout} />
                  ))}
                </div>

                {/* Show More Incomplete Button */}
                {showIncompleteShowMore && (
                  <button
                    onClick={handleLoadMoreIncomplete}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Show {Math.min(INCOMPLETE_LOAD_MORE, incompleteTotal - incompleteWorkouts.length)} More
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            {hasIncomplete && hasCompleted && (
              <div className="border-t border-gray-800 mb-6" />
            )}

            {/* Completed Workouts Section */}
            {hasCompleted && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Completed Workouts</h2>
                <div className="space-y-3">
                  {completedWorkouts.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                  ))}
                </div>

                {/* Load More Completed Button */}
                {hasMoreCompleted && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleLoadMoreCompleted}
                      disabled={loadingMoreCompleted}
                      className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-700 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMoreCompleted ? (
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

                {/* End of List */}
                {!hasMoreCompleted && completedWorkouts.length > 0 && (
                  <div className="mt-6 text-center text-sm text-gray-500">
                    You've reached the end of your workout history
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!hasIncomplete && !hasCompleted && <EmptyWorkoutState />}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

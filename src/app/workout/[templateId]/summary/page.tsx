'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, Clock, Dumbbell, TrendingUp, ArrowRight } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { BottomNav } from '@/components/ui/bottom-nav';

interface WorkoutSession {
  id: string;
  workout_name: string;
  started_at: string;
  completed_at: string;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
}

interface ExerciseStats {
  exercise_name: string;
  sets_count: number;
  total_reps: number;
  total_volume: number;
  avg_weight: number;
  equipment_type?: string;
}

export default function WorkoutSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkoutSummary() {
      if (typeof window === 'undefined') return;

      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch the most recent completed workout session for this template
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('template_id', templateId)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionError) throw sessionError;
        if (!sessionData) throw new Error('Workout session not found');

        setSession(sessionData);

        // Fetch exercise-level stats
        const { data: workoutExercises, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select('id, exercise_id, exercises(name, equipment_type)')
          .eq('workout_id', sessionData.id);

        if (exercisesError) throw exercisesError;

        // Fetch sets for each exercise
        const stats: ExerciseStats[] = [];

        for (const workoutEx of workoutExercises || []) {
          const { data: sets, error: setsError } = await supabase
            .from('exercise_sets')
            .select('weight_kg, reps')
            .eq('workout_exercise_id', workoutEx.id);

          if (setsError) throw setsError;

          if (sets && sets.length > 0) {
            const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
            const totalVolume = sets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);
            const avgWeight = sets.reduce((sum, set) => sum + set.weight_kg, 0) / sets.length;

            stats.push({
              exercise_name: (workoutEx.exercises as any)?.name || 'Unknown Exercise',
              sets_count: sets.length,
              total_reps: totalReps,
              total_volume: totalVolume,
              avg_weight: avgWeight,
              equipment_type: (workoutEx.exercises as any)?.equipment_type,
            });
          }
        }

        setExerciseStats(stats);

      } catch (err: any) {
        console.error('Error fetching workout summary:', err);
        setError(err?.message || 'Failed to load workout summary');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkoutSummary();
  }, [templateId, router]);

  // Calculate workout duration
  const getDuration = () => {
    if (!session) return '0m';
    const start = new Date(session.started_at);
    const end = new Date(session.completed_at);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading summary...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-sm">{error || 'Workout not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-700">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-center">Workout Complete! 🎉</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6 max-w-md mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center pt-4">
            <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          {/* Workout Name */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{session.workout_name}</h2>
            <p className="text-gray-400 text-sm">Great work! Here's your summary</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Duration</span>
              </div>
              <p className="text-2xl font-bold text-white">{getDuration()}</p>
            </div>

            {/* Total Sets */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Total Sets</span>
              </div>
              <p className="text-2xl font-bold text-white">{session.total_sets}</p>
            </div>

            {/* Total Reps */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Total Reps</span>
              </div>
              <p className="text-2xl font-bold text-white">{session.total_reps}</p>
            </div>

            {/* Total Volume */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Volume</span>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(session.total_volume_kg)}
                <span className="text-sm text-gray-400 ml-1">kg</span>
              </p>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Exercise Breakdown</h3>
            
            {exerciseStats.map((exercise, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{exercise.exercise_name}</h4>
                    {exercise.equipment_type && (
                      <p className="text-xs text-gray-400 capitalize">{exercise.equipment_type}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Sets</p>
                    <p className="text-lg font-bold text-white">{exercise.sets_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Reps</p>
                    <p className="text-lg font-bold text-white">{exercise.total_reps}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Volume</p>
                    <p className="text-lg font-bold text-white">
                      {Math.round(exercise.total_volume)}
                      <span className="text-xs text-gray-400 ml-1">kg</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Avg Weight</span>
                    <span className="text-white font-semibold">{exercise.avg_weight.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Done Button */}
          <button
            onClick={() => router.push('/log')}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-500 hover:to-green-600 transition-all active:scale-[0.98] shadow-lg shadow-green-500/25"
          >
            Done
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

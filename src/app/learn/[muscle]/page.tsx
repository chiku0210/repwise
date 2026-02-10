'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';
import { ExerciseCard } from '@/components/exercise-card';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getMuscleMap } from '@/lib/utils/muscles';
import {
  Exercise,
  Muscle,
  MUSCLE_GROUPS,
  MUSCLE_TO_CATEGORY,
  SKELETON_COUNT,
  IMG_PLACEHOLDER,
} from '@/lib/types/exercise';

interface ExerciseWithMuscleNames extends Exercise {
  primaryMuscleNames: string[];
}

export default function MuscleExercisesPage() {
  const params = useParams();
  const router = useRouter();
  const muscleCategory = params.muscle as string;

  const [exercises, setExercises] = useState<ExerciseWithMuscleNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const muscleGroup = MUSCLE_GROUPS.find((g) => g.id === muscleCategory);

  async function fetchExercises() {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseBrowserClient();

      // Fetch all muscles and build the mapping using shared utility
      const muscleMap = await getMuscleMap(supabase);

      // Get all muscles to find relevant muscle IDs
      const { data: muscles, error: musclesError } = await supabase
        .from('muscles')
        .select('*');

      if (musclesError) throw musclesError;

      // Find muscle IDs that belong to this category
      const relevantMuscleIds = muscles
        ?.filter((m: Muscle) => {
          const category = MUSCLE_TO_CATEGORY[m.name];
          return category === muscleCategory;
        })
        .map((m: Muscle) => m.id) || [];

      if (relevantMuscleIds.length === 0) {
        setExercises([]);
        setLoading(false);
        return;
      }

      // Fetch exercises with database-level filtering
      // Note: Using .contains() for array overlap filtering
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (exercisesError) throw exercisesError;

      // Filter exercises that have at least one relevant muscle in primary_muscles
      const filteredExercises = exercisesData?.filter((ex: Exercise) => {
        return ex.primary_muscles.some((muscleId) =>
          relevantMuscleIds.includes(muscleId)
        );
      }) || [];

      // Map muscle IDs to names
      const exercisesWithNames: ExerciseWithMuscleNames[] = filteredExercises.map(
        (ex: Exercise) => ({
          ...ex,
          primaryMuscleNames: ex.primary_muscles
            .map((id) => muscleMap.get(id))
            .filter((name): name is string => !!name),
        })
      );

      setExercises(exercisesWithNames);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muscleCategory]);

  if (!muscleGroup) {
    return (
      <AuthGate>
        <main className="min-h-screen bg-[#0a1628] pb-20">
          <div className="mx-auto max-w-md p-6">
            <div className="text-center">
              <p className="text-gray-400">Muscle group not found</p>
              <button
                onClick={() => router.push('/learn')}
                className="mt-4 text-blue-400 hover:text-blue-300"
                aria-label="Back to Learn page"
              >
                ← Back to Learn
              </button>
            </div>
          </div>
          <BottomNav />
        </main>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          {/* Header */}
          <div className="space-y-2">
            <button
              onClick={() => router.push('/learn')}
              className="text-sm text-gray-400 hover:text-gray-300"
              aria-label="Back to Learn page"
            >
              ← Back to Learn
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono text-blue-400/60">{IMG_PLACEHOLDER}</span>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {muscleGroup.name}
                </h1>
                <p className="text-sm text-gray-400">{muscleGroup.description}</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-[#0f1e33]"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">Error: {error}</p>
              <button
                onClick={fetchExercises}
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Exercise List */}
          {!loading && !error && (
            <div className="space-y-3">
              {exercises.length === 0 ? (
                <div className="rounded-lg bg-[#0f1e33] p-8 text-center">
                  <p className="text-gray-400">
                    No exercises found for this muscle group.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-400">
                    {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                  </p>
                  {exercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      primaryMuscleNames={exercise.primaryMuscleNames}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

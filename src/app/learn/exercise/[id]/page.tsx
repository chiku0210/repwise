'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Exercise, Muscle } from '@/lib/types/exercise';

const EQUIPMENT_ICONS: Record<string, string> = {
  barbell: '🏋️',
  dumbbell: '💪',
  machine: '⚙️',
  bodyweight: '🧘',
  cable: '🔗',
  other: '🎯',
};

interface ExerciseWithMuscleNames extends Exercise {
  primaryMuscleNames: string[];
  secondaryMuscleNames: string[];
}

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<ExerciseWithMuscleNames | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercise() {
      try {
        setLoading(true);
        setError(null);
        const supabase = getSupabaseBrowserClient();

        // Fetch the exercise
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();

        if (exerciseError) throw exerciseError;
        if (!exerciseData) throw new Error('Exercise not found');

        // Fetch all muscles to map IDs to names
        const { data: muscles, error: musclesError } = await supabase
          .from('muscles')
          .select('*');

        if (musclesError) throw musclesError;

        const muscleMap = new Map<string, string>();
        muscles?.forEach((m: Muscle) => {
          muscleMap.set(m.id, m.name);
        });

        // Map muscle IDs to names
        const exerciseWithNames: ExerciseWithMuscleNames = {
          ...exerciseData,
          primaryMuscleNames: (exerciseData.primary_muscles || [])
            .map((id: string) => muscleMap.get(id))
            .filter((name): name is string => !!name),
          secondaryMuscleNames: (exerciseData.secondary_muscles || [])
            .map((id: string) => muscleMap.get(id))
            .filter((name): name is string => !!name),
        };

        setExercise(exerciseWithNames);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exercise');
      } finally {
        setLoading(false);
      }
    }

    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            ← Back
          </button>

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded-lg bg-[#0f1e33]" />
              <div className="h-32 animate-pulse rounded-lg bg-[#0f1e33]" />
              <div className="h-64 animate-pulse rounded-lg bg-[#0f1e33]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Exercise Details */}
          {!loading && !error && exercise && (
            <div className="space-y-6">
              {/* Exercise Name & Equipment */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-white">
                    {exercise.name}
                  </h1>
                  <span className="text-4xl">
                    {EQUIPMENT_ICONS[exercise.equipment_type] ||
                      EQUIPMENT_ICONS.other}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                    {exercise.equipment_type}
                  </span>
                  {exercise.is_compound && (
                    <span className="rounded bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                      Compound
                    </span>
                  )}
                  <span className="rounded bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
                    {exercise.category}
                  </span>
                </div>
              </div>

              {/* Muscles Worked */}
              <div className="space-y-4 rounded-lg bg-[#0f1e33] p-5 shadow-lg">
                <h2 className="text-lg font-semibold text-white">
                  Muscles Worked
                </h2>
                <div className="space-y-3">
                  {exercise.primaryMuscleNames.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-400">
                        Primary
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {exercise.primaryMuscleNames.map((muscle) => (
                          <span
                            key={muscle}
                            className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {exercise.secondaryMuscleNames.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-400">
                        Secondary
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {exercise.secondaryMuscleNames.map((muscle) => (
                          <span
                            key={muscle}
                            className="rounded-full bg-gray-700 px-3 py-1 text-sm font-medium text-gray-300"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Cues */}
              {exercise.form_cues && exercise.form_cues.length > 0 && (
                <div className="space-y-4 rounded-lg bg-[#0f1e33] p-5 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">Form Cues</h2>
                  <ul className="space-y-3">
                    {exercise.form_cues.map((cue, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm font-medium text-blue-400">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm leading-relaxed text-gray-300">
                          {cue}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button (Placeholder) */}
              <button
                disabled
                className="w-full rounded-lg bg-blue-500/50 py-3 font-semibold text-white opacity-50 cursor-not-allowed"
              >
                Add to Quick Log (Coming Soon)
              </button>

              {/* Info */}
              <div className="rounded-lg border border-gray-700 bg-[#0f1e33] p-4">
                <p className="text-xs text-gray-400">
                  💡 Focus on controlled movements and proper form over heavy
                  weight. Record your sets in the Log tab.
                </p>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

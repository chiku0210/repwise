'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExercisePicker from '@/components/exercise-picker';
import SetForm from '@/components/set-form';
import SetList from '@/components/set-list';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  is_compound: boolean;
}

interface WorkoutSet {
  id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number;
}

export default function QuickLogPage() {
  const router = useRouter();
  const [showExercisePicker, setShowExercisePicker] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Create workout record on first set
  const createWorkout = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to log workouts');
        return null;
      }

      const { data, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (workoutError) throw workoutError;

      return data.id;
    } catch (err) {
      console.error('Error creating workout:', err);
      setError('Failed to create workout. Please try again.');
      return null;
    }
  };

  // Log a set
  const handleSetSubmit = async (setData: { weight_kg: number; reps: number; rpe: number }) => {
    if (!selectedExercise) return;
    if (typeof window === 'undefined') return;

    setLoading(true);
    setError(null);

    try {
      // Create workout if this is the first set
      let currentWorkoutId = workoutId;
      if (!currentWorkoutId) {
        currentWorkoutId = await createWorkout();
        if (!currentWorkoutId) {
          setLoading(false);
          return;
        }
        setWorkoutId(currentWorkoutId);
      }

      const supabase = getSupabaseBrowserClient();

      // Insert set
      const { data, error: setError } = await supabase
        .from('sets')
        .insert({
          workout_id: currentWorkoutId,
          exercise_id: selectedExercise.id,
          set_number: sets.length + 1,
          weight_kg: setData.weight_kg,
          reps: setData.reps,
          rpe: setData.rpe,
        })
        .select('id')
        .single();

      if (setError) throw setError;

      // Add to local state
      const newSet: WorkoutSet = {
        id: data.id,
        set_number: sets.length + 1,
        weight_kg: setData.weight_kg,
        reps: setData.reps,
        rpe: setData.rpe,
      };

      setSets([...sets, newSet]);
    } catch (err) {
      console.error('Error logging set:', err);
      setError('Failed to log set. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a set
  const handleDeleteSet = async (setId: string) => {
    if (typeof window === 'undefined') return;
    if (!confirm('Delete this set?')) return;

    try {
      const supabase = getSupabaseBrowserClient();

      const { error: deleteError } = await supabase
        .from('sets')
        .delete()
        .eq('id', setId);

      if (deleteError) throw deleteError;

      // Update local state and renumber sets
      const updatedSets = sets
        .filter((s) => s.id !== setId)
        .map((s, index) => ({ ...s, set_number: index + 1 }));

      setSets(updatedSets);
    } catch (err) {
      console.error('Error deleting set:', err);
      setError('Failed to delete set. Please try again.');
    }
  };

  // Finish workout
  const handleFinishWorkout = async () => {
    if (!workoutId || sets.length === 0) return;
    if (typeof window === 'undefined') return;

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();

      // Update workout with finished timestamp
      const { error: updateError } = await supabase
        .from('workouts')
        .update({ finished_at: new Date().toISOString() })
        .eq('id', workoutId);

      if (updateError) throw updateError;

      // Show success state
      setSuccess(true);

      // Redirect to log tab after brief delay
      setTimeout(() => {
        router.push('/log');
      }, 1500);
    } catch (err) {
      console.error('Error finishing workout:', err);
      setError('Failed to finish workout. Please try again.');
      setLoading(false);
    }
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExercisePicker(false);
  };

  const handleBackClick = () => {
    if (sets.length > 0) {
      if (confirm('You have unsaved sets. Are you sure you want to leave?')) {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628] p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Workout Saved!</h2>
          <p className="text-gray-400">Great work! Redirecting to your log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-[#0f1c2e]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBackClick}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Quick Log</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-900/20 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {!selectedExercise ? (
          // Empty state - show when no exercise selected
          <div className="mt-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/20">
              <Plus className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Select an exercise to start</h2>
            <p className="mb-6 text-gray-400">Choose from our catalog of exercises</p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Choose Exercise
            </button>
          </div>
        ) : (
          // Exercise selected - show set logging interface
          <>
            {/* Exercise Header */}
            <div className="rounded-lg bg-[#0f1c2e] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedExercise.name}</h2>
                  <p className="text-sm text-gray-400">{selectedExercise.equipment}</p>
                </div>
                <button
                  onClick={() => setShowExercisePicker(true)}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Logged Sets */}
            {sets.length > 0 && (
              <SetList sets={sets} onDelete={handleDeleteSet} />
            )}

            {/* Set Input Form */}
            <SetForm
              onSubmit={handleSetSubmit}
              setNumber={sets.length + 1}
              loading={loading}
            />

            {/* Finish Workout Button */}
            {sets.length > 0 && (
              <button
                onClick={handleFinishWorkout}
                disabled={loading}
                className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 transition-all disabled:bg-gray-700 disabled:text-gray-400"
              >
                {loading ? 'Finishing...' : `Finish Workout (${sets.length} ${sets.length === 1 ? 'set' : 'sets'})`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <ExercisePicker
          onSelect={handleExerciseSelect}
          onClose={() => {
            if (!selectedExercise) {
              // If no exercise selected yet, go back to dashboard
              router.push('/dashboard');
            } else {
              // Just close the modal
              setShowExercisePicker(false);
            }
          }}
        />
      )}
    </div>
  );
}

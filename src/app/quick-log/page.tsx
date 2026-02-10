'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ExercisePicker from '@/components/exercise-picker';
import SetForm from '@/components/set-form';
import SetList from '@/components/set-list';
import ConfirmDialog from '@/components/confirm-dialog';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

// Constants
const DEFAULT_TARGET_SETS = 3;
const SUCCESS_REDIRECT_DELAY_MS = 1500;

interface Exercise {
  id: string;
  name: string;
  equipment_type: string;
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
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showExercisePicker, setShowExercisePicker] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [workoutSessionId, setWorkoutSessionId] = useState<string | null>(null);
  const [workoutExerciseId, setWorkoutExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // Create workout session and workout_exercise record on first set
  const createWorkoutSession = async (
    exerciseId: string
  ): Promise<{ sessionId: string; workoutExerciseId: string } | null> => {
    if (typeof window === 'undefined') return null;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to log workouts');
        return null;
      }

      // Create workout session if it doesn't exist
      let sessionId = workoutSessionId;
      if (!sessionId) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: user.id,
            started_at: new Date().toISOString(),
            workout_name: 'Quick Log',
          })
          .select('id')
          .single();

        if (sessionError) throw sessionError;
        sessionId = sessionData.id;
      }

      // Type guard to ensure sessionId is not null
      if (!sessionId) {
        throw new Error('Failed to create or retrieve workout session');
      }

      // Create workout_exercise record for the new exercise
      const { data: workoutExData, error: workoutExError } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: sessionId,
          exercise_id: exerciseId,
          order_index: 1,
          target_sets: DEFAULT_TARGET_SETS,
        })
        .select('id')
        .single();

      if (workoutExError) throw workoutExError;

      return {
        sessionId: sessionId,
        workoutExerciseId: workoutExData.id,
      };
    } catch (err) {
      console.error('Error creating workout session:', err);
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
      // Create workout session if this is the first set
      let currentWorkoutExerciseId = workoutExerciseId;
      if (!currentWorkoutExerciseId) {
        const result = await createWorkoutSession(selectedExercise.id);
        if (!result) {
          setLoading(false);
          return;
        }
        setWorkoutSessionId(result.sessionId);
        setWorkoutExerciseId(result.workoutExerciseId);
        currentWorkoutExerciseId = result.workoutExerciseId;
      }

      const supabase = getSupabaseBrowserClient();

      // Insert set into exercise_sets table
      const { data, error: setError } = await supabase
        .from('exercise_sets')
        .insert({
          workout_exercise_id: currentWorkoutExerciseId,
          set_number: sets.length + 1,
          weight_kg: setData.weight_kg,
          reps: setData.reps,
          rpe: setData.rpe,
          completed: true,
          timestamp: new Date().toISOString(),
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

    // Show custom confirmation dialog
    setConfirmDialog({
      show: true,
      title: 'Delete Set',
      message: 'Are you sure you want to delete this set?',
      onConfirm: async () => {
        try {
          const supabase = getSupabaseBrowserClient();

          // Delete the set from database
          const { error: deleteError } = await supabase
            .from('exercise_sets')
            .delete()
            .eq('id', setId);

          if (deleteError) throw deleteError;

          // Update local state and renumber sets
          const updatedSets = sets
            .filter((s) => s.id !== setId)
            .map((s, index) => ({ ...s, set_number: index + 1 }));

          // Update set numbers in database for remaining sets
          for (const set of updatedSets) {
            const { error: updateError } = await supabase
              .from('exercise_sets')
              .update({ set_number: set.set_number })
              .eq('id', set.id);

            if (updateError) {
              console.error('Error updating set number:', updateError);
              throw updateError;
            }
          }

          setSets(updatedSets);
        } catch (err) {
          console.error('Error deleting set:', err);
          setError('Failed to delete set. Please try again.');
        } finally {
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        }
      },
    });
  };

  // Finish current exercise (save to database)
  const finishCurrentExercise = async (): Promise<boolean> => {
    if (!workoutSessionId || sets.length === 0) return false;
    if (typeof window === 'undefined') return false;

    try {
      const supabase = getSupabaseBrowserClient();

      // Update workout session with stats (no completed_at yet - workout continues)
      const totalVolume = sets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);
      const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

      // Note: We don't set completed_at here because workout continues with new exercise
      const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({
          total_sets: sets.length,
          total_reps: totalReps,
          total_volume_kg: totalVolume,
        })
        .eq('id', workoutSessionId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error('Error finishing exercise:', err);
      setError('Failed to save exercise. Please try again.');
      return false;
    }
  };

  // Finish entire workout (final save with completed_at)
  const handleFinishWorkout = async () => {
    if (!workoutSessionId || sets.length === 0) return;
    if (typeof window === 'undefined') return;

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();

      // Update workout session with completed timestamp and stats
      const totalVolume = sets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);
      const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

      const { error: updateError } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          total_sets: sets.length,
          total_reps: totalReps,
          total_volume_kg: totalVolume,
        })
        .eq('id', workoutSessionId);

      if (updateError) throw updateError;

      // Show success state
      setSuccess(true);

      // Redirect to log tab after brief delay (with cleanup)
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/log');
      }, SUCCESS_REDIRECT_DELAY_MS);
    } catch (err) {
      console.error('Error finishing workout:', err);
      setError('Failed to finish workout. Please try again.');
      setLoading(false);
    }
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    // Use callback to ensure state is updated before closing
    setSelectedExercise(exercise);
    // Slight delay to ensure state update completes
    setTimeout(() => {
      setShowExercisePicker(false);
    }, 0);
  };

  const handlePickerClose = () => {
    if (!selectedExercise) {
      // If no exercise selected and user closes picker, go back to home
      router.push('/');
    } else {
      // Just close the modal
      setShowExercisePicker(false);
    }
  };

  // Handle "Change" button click
  const handleChangeExercise = () => {
    if (sets.length > 0) {
      // If sets exist, confirm and auto-finish current exercise
      setConfirmDialog({
        show: true,
        title: 'Finish Current Exercise?',
        message: `You have ${sets.length} set${sets.length > 1 ? 's' : ''} logged for ${selectedExercise?.name}. This exercise will be saved and you can start a new one.`,
        onConfirm: async () => {
          // Close dialog first
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
          
          // Save current exercise to database
          const saved = await finishCurrentExercise();
          
          if (saved) {
            // Reset state for new exercise
            setSets([]);
            setWorkoutExerciseId(null);
            setSelectedExercise(null);
            
            // Open exercise picker for new exercise
            setShowExercisePicker(true);
          }
        },
      });
    } else {
      // No sets logged, safe to change exercise
      setWorkoutExerciseId(null);
      setShowExercisePicker(true);
    }
  };

  const handleBackClick = () => {
    if (sets.length > 0) {
      // If sets are logged, show custom confirmation
      setConfirmDialog({
        show: true,
        title: 'Leave Workout?',
        message: 'You have unsaved sets. Are you sure you want to leave?',
        onConfirm: () => {
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
          router.push('/');
        },
      });
    } else if (selectedExercise) {
      // If exercise selected but no sets, go back to exercise picker
      setSelectedExercise(null);
      setWorkoutExerciseId(null);
      setShowExercisePicker(true);
    } else {
      // No exercise selected, go back to home
      router.push('/');
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
        <div className="mx-4 mt-4 rounded-lg bg-red-900/20 border border-red-800 p-4">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Main Content - Mobile First */}
      <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4">
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
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors active:scale-95"
            >
              Choose Exercise
            </button>
          </div>
        ) : (
          // Exercise selected - show set logging interface
          <>
            {/* Exercise Header */}
            <div className="rounded-lg bg-[#0f1c2e] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">{selectedExercise.name}</h2>
                  <p className="text-sm text-gray-400 capitalize">{selectedExercise.equipment_type}</p>
                </div>
                <button
                  onClick={handleChangeExercise}
                  className="flex-shrink-0 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors active:scale-95"
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
                className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 transition-all active:scale-[0.98] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
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
          onClose={handlePickerClose}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} })}
      />
    </div>
  );
}

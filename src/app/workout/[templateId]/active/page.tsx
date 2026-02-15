'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, SkipForward, CheckCircle } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { BottomNav } from '@/components/ui/bottom-nav';
import { ProgressBar } from '@/components/workout/ProgressBar';
import { ExerciseHeader } from '@/components/workout/ExerciseHeader';
import { FormCuesCollapsible } from '@/components/workout/FormCuesCollapsible';
import { SetInputForm } from '@/components/workout/SetInputForm';
import { LoggedSetItem } from '@/components/workout/LoggedSetItem';
import ConfirmDialog from '@/components/confirm-dialog';

interface Exercise {
  exercise_id: string;
  exercise_name: string;
  target_sets: number;
  reps_range: string;
  rest_seconds: number;
  order_index: number;
  notes?: string;
  form_cues?: string[];
  equipment_type?: string;
}

interface WorkoutSet {
  id?: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number;
}

interface ConfirmDialogState {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function WorkoutPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, WorkoutSet[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [workoutSessionId, setWorkoutSessionId] = useState<string | null>(null);
  const [workoutExerciseIds, setWorkoutExerciseIds] = useState<Record<string, string>>({});
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Fetch template and create workout session
  useEffect(() => {
    async function initializeWorkout() {
      if (typeof window === 'undefined') return;

      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        console.log('User authenticated:', user.id);

        // Fetch template with exercises
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('id, name, exercises')
          .eq('id', templateId)
          .single();

        if (templateError) {
          console.error('Template error:', templateError);
          throw new Error(`Template error: ${templateError.message}`);
        }
        if (!templateData) throw new Error('Template not found');

        console.log('Template loaded:', templateData.name);

        // Fetch exercise details
        const exerciseIds = templateData.exercises.map((ex: any) => ex.exercise_id);
        const { data: exerciseDetails, error: exerciseError } = await supabase
          .from('exercises')
          .select('id, name, equipment_type, form_cues')
          .in('id', exerciseIds);

        if (exerciseError) {
          console.error('Exercise error:', exerciseError);
          throw new Error(`Exercise error: ${exerciseError.message}`);
        }

        console.log('Exercises loaded:', exerciseDetails?.length);

        // Enrich exercises with details
        const exerciseMap = new Map(exerciseDetails?.map(ex => [ex.id, ex]) || []);
        const enrichedExercises: Exercise[] = templateData.exercises
          .map((ex: any) => {
            const details = exerciseMap.get(ex.exercise_id);
            return {
              exercise_id: ex.exercise_id,
              exercise_name: details?.name || 'Unknown Exercise',
              target_sets: ex.target_sets,
              reps_range: ex.reps_range,
              rest_seconds: ex.rest_seconds,
              order_index: ex.order_index,
              notes: ex.notes,
              form_cues: details?.form_cues || [],
              equipment_type: details?.equipment_type,
            };
          })
          .sort((a: { order_index: number; }, b: { order_index: number; }) => a.order_index - b.order_index);

        setExercises(enrichedExercises);
        console.log('Enriched exercises set:', enrichedExercises.length);

        // Create workout session
        console.log('Creating workout session...');
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: user.id,
            template_id: templateId,
            workout_name: templateData.name,
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error(`Session creation failed: ${sessionError.message} (Code: ${sessionError.code})`);
        }
        if (!sessionData) throw new Error('Session created but no data returned');

        setWorkoutSessionId(sessionData.id);
        console.log('Workout session created:', sessionData.id);

        // Create workout_exercises records
        const workoutExercises = enrichedExercises.map((ex, index) => ({
          workout_id: sessionData.id,
          exercise_id: ex.exercise_id,
          order_index: index + 1,
          target_sets: ex.target_sets,
        }));

        console.log('Inserting workout exercises:', workoutExercises.length);
        const { data: workoutExData, error: workoutExError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercises)
          .select('id, exercise_id');

        if (workoutExError) {
          console.error('Workout exercises error:', workoutExError);
          throw new Error(`Workout exercises insert failed: ${workoutExError.message} (Code: ${workoutExError.code})`);
        }

        console.log('Workout exercises created:', workoutExData?.length);

        // Map exercise_id to workout_exercise_id
        const idMap: Record<string, string> = {};
        workoutExData?.forEach(item => {
          idMap[item.exercise_id] = item.id;
        });
        setWorkoutExerciseIds(idMap);

        console.log('Initialization complete!');

      } catch (err: any) {
        console.error('Error initializing workout:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        const errorMessage = err?.message || err?.toString() || 'Failed to start workout';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    initializeWorkout();
  }, [templateId, router]);

  // Handle set submission
  const handleSetSubmit = async (setData: { weight_kg: number; reps: number; rpe: number }) => {
    if (!workoutSessionId || typeof window === 'undefined') return;

    setSubmitting(true);
    try {
      const currentExercise = exercises[currentExerciseIndex];
      const workoutExerciseId = workoutExerciseIds[currentExercise.exercise_id];
      const currentSets = completedSets[currentExerciseIndex] || [];
      const setNumber = currentSets.length + 1;

      const supabase = getSupabaseBrowserClient();

      // Insert set
      const { data, error: setError } = await supabase
        .from('exercise_sets')
        .insert({
          workout_exercise_id: workoutExerciseId,
          set_number: setNumber,
          weight_kg: setData.weight_kg,
          reps: setData.reps,
          rpe: setData.rpe,
          completed: true,
          timestamp: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (setError) throw setError;

      // Update local state
      setCompletedSets(prev => ({
        ...prev,
        [currentExerciseIndex]: [
          ...currentSets,
          { id: data.id, set_number: setNumber, ...setData },
        ],
      }));

    } catch (err) {
      console.error('Error logging set:', err);
      setError('Failed to log set. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle set deletion
  const handleDeleteSet = async (setId: string) => {
    if (typeof window === 'undefined') return;

    setConfirmDialog({
      show: true,
      title: 'Delete Set',
      message: 'Are you sure you want to delete this set?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          const { error } = await supabase
            .from('exercise_sets')
            .delete()
            .eq('id', setId);

          if (error) throw error;

          // Update local state
          const currentSets = completedSets[currentExerciseIndex] || [];
          const updatedSets = currentSets
            .filter(s => s.id !== setId)
            .map((s, idx) => ({ ...s, set_number: idx + 1 }));

          setCompletedSets(prev => ({
            ...prev,
            [currentExerciseIndex]: updatedSets,
          }));

        } catch (err) {
          console.error('Error deleting set:', err);
          setError('Failed to delete set.');
        } finally {
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        }
      },
    });
  };

  // Handle next exercise
  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Finish workout
      handleFinishWorkout();
    }
  };

  // Handle "Complete Later" (skip to end)
  const handleCompleteLater = () => {
    setConfirmDialog({
      show: true,
      title: 'Move to End',
      message: 'Move this exercise to the end of your workout?',
      variant: 'info',
      onConfirm: () => {
        // Move current exercise to end
        const newExercises = [...exercises];
        const [removed] = newExercises.splice(currentExerciseIndex, 1);
        newExercises.push(removed);
        setExercises(newExercises);
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  };

  // Handle finish workout
  const handleFinishWorkout = async () => {
    if (!workoutSessionId || typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();

      // Calculate totals
      const allSets = Object.values(completedSets).flat();
      const totalSets = allSets.length;
      const totalReps = allSets.reduce((sum, set) => sum + set.reps, 0);
      const totalVolume = allSets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);

      // Update session
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          total_sets: totalSets,
          total_reps: totalReps,
          total_volume_kg: totalVolume,
        })
        .eq('id', workoutSessionId);

      if (error) throw error;

      // Navigate to summary (Phase 1D)
      router.push(`/workout/${templateId}/summary`);

    } catch (err) {
      console.error('Error finishing workout:', err);
      setError('Failed to finish workout.');
    }
  };

  // Handle back button (exit workout)
  const handleBackClick = () => {
    setConfirmDialog({
      show: true,
      title: 'Exit Workout',
      message: 'Your progress will be saved. You can resume later from your workout history.',
      variant: 'warning',
      onConfirm: () => {
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        router.push('/');
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Starting workout...</p>
        </div>
      </div>
    );
  }

  if (error && exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-sm">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const currentSets = completedSets[currentExerciseIndex] || [];
  const lastSet = currentSets[currentSets.length - 1] || null;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Active Workout</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-900/20 border border-red-800 p-4">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-4 max-w-md mx-auto">
          {/* Progress Bar */}
          <ProgressBar
            currentExercise={currentExerciseIndex + 1}
            totalExercises={exercises.length}
          />

          {/* Exercise Header */}
          <ExerciseHeader
            exerciseName={currentExercise.exercise_name}
            targetSets={currentExercise.target_sets}
            repsRange={currentExercise.reps_range}
            restSeconds={currentExercise.rest_seconds}
            completedSets={currentSets.length}
            equipmentType={currentExercise.equipment_type}
          />

          {/* Form Cues */}
          {currentExercise.form_cues && currentExercise.form_cues.length > 0 && (
            <FormCuesCollapsible cues={currentExercise.form_cues} />
          )}

          {/* Logged Sets */}
          {currentSets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400">Completed Sets</h3>
              {currentSets.map((set) => (
                <LoggedSetItem
                  key={set.id}
                  setNumber={set.set_number}
                  weight_kg={set.weight_kg}
                  reps={set.reps}
                  rpe={set.rpe}
                  onDelete={set.id ? () => handleDeleteSet(set.id!) : undefined}
                />
              ))}
            </div>
          )}

          {/* Set Input Form */}
          <SetInputForm
            setNumber={currentSets.length + 1}
            onSubmit={handleSetSubmit}
            loading={submitting}
            lastSetData={lastSet}
          />

          {/* Bottom Actions */}
          <div className="space-y-3 pt-2">
            {/* Next Exercise / Finish Workout */}
            <button
              onClick={handleNextExercise}
              disabled={currentSets.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-600 transition-all active:scale-[0.98] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {isLastExercise ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Finish Workout
                </>
              ) : (
                <>
                  <SkipForward className="w-6 h-6" />
                  Next Exercise
                </>
              )}
            </button>

            {/* Complete Later */}
            {!isLastExercise && (
              <button
                onClick={handleCompleteLater}
                className="w-full bg-gray-800 text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                Complete Later (Move to End)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} })}
        variant={confirmDialog.variant}
      />

      <BottomNav />
    </div>
  );
}

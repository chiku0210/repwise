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
import { RestTimer } from '@/components/workout/RestTimer';
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
  const [templateName, setTemplateName] = useState<string>('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, WorkoutSet[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [workoutSessionId, setWorkoutSessionId] = useState<string | null>(null);
  const [workoutExerciseIds, setWorkoutExerciseIds] = useState<Record<string, string>>({});
  
  // Rest timer state
  const [showRestTimer, setShowRestTimer] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Initialize workout - load template and check for existing session
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
        setTemplateName(templateData.name);

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

        // **CRITICAL: Check for existing incomplete session (handles refresh + resume)**
        await checkAndRestoreSession(user.id, enrichedExercises);

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

  // Check for existing session and restore if found
  const checkAndRestoreSession = async (userId: string, enrichedExercises: Exercise[]) => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();

      // Check for incomplete session for this template
      const { data: sessions, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('template_id', templateId)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (sessionError) {
        console.error('Error checking for existing session:', sessionError);
        return;
      }

      if (!sessions || sessions.length === 0) {
        console.log('No existing session - fresh start (session created on first set)');
        return;
      }

      const existingSession = sessions[0];
      console.log('Found existing session - restoring...', existingSession.id);

      // Restore session
      await restoreWorkoutSession(existingSession.id, enrichedExercises);

    } catch (err) {
      console.error('Error in checkAndRestoreSession:', err);
      // Don't fail initialization - just log and continue
    }
  };

  // Restore existing workout session
  const restoreWorkoutSession = async (sessionId: string, enrichedExercises: Exercise[]) => {
    if (typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();

      console.log('Restoring session:', sessionId);

      // Fetch workout_exercises
      const { data: workoutExercises, error: exerciseError } = await supabase
        .from('workout_exercises')
        .select('id, exercise_id')
        .eq('workout_id', sessionId);

      if (exerciseError) throw exerciseError;

      // Build exercise ID map
      const idMap: Record<string, string> = {};
      workoutExercises?.forEach(item => {
        idMap[item.exercise_id] = item.id;
      });

      console.log('Workout exercises restored:', Object.keys(idMap).length);

      // Fetch all logged sets
      const { data: allSets, error: setsError } = await supabase
        .from('exercise_sets')
        .select('id, workout_exercise_id, set_number, weight_kg, reps, rpe')
        .in('workout_exercise_id', Object.values(idMap))
        .order('set_number', { ascending: true });

      if (setsError) throw setsError;

      console.log('Total sets restored:', allSets?.length || 0);

      // Group sets by exercise index
      const completedSetsMap: Record<number, WorkoutSet[]> = {};
      
      enrichedExercises.forEach((exercise, index) => {
        const workoutExerciseId = idMap[exercise.exercise_id];
        if (!workoutExerciseId) return;

        const exerciseSets = allSets?.filter(set => set.workout_exercise_id === workoutExerciseId) || [];
        
        if (exerciseSets.length > 0) {
          completedSetsMap[index] = exerciseSets.map(set => ({
            id: set.id,
            set_number: set.set_number,
            weight_kg: set.weight_kg,
            reps: set.reps,
            rpe: set.rpe,
          }));
        }
      });

      // Find current exercise (first exercise with incomplete sets)
      let currentIndex = 0;
      for (let i = 0; i < enrichedExercises.length; i++) {
        const sets = completedSetsMap[i] || [];
        const targetSets = enrichedExercises[i].target_sets;
        
        if (sets.length < targetSets) {
          currentIndex = i;
          break;
        }
        
        // If all target sets completed, move to next
        if (i < enrichedExercises.length - 1) {
          currentIndex = i + 1;
        }
      }

      // Update state
      setWorkoutSessionId(sessionId);
      setWorkoutExerciseIds(idMap);
      setCompletedSets(completedSetsMap);
      setCurrentExerciseIndex(currentIndex);

      console.log('Session restored successfully!');
      console.log('- Sets by exercise:', Object.keys(completedSetsMap).map(k => `Ex${k}: ${completedSetsMap[parseInt(k)].length}`));
      console.log('- Current exercise index:', currentIndex);

    } catch (err) {
      console.error('Error restoring workout session:', err);
      throw err;
    }
  };

  // Create workout session and workout_exercises
  const createWorkoutSession = async () => {
    if (typeof window === 'undefined') return null;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      console.log('Creating workout session on first set...');

      // Create workout session
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          template_id: templateId,
          workout_name: templateName,
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error(`Session creation failed: ${sessionError.message}`);
      }
      if (!sessionData) throw new Error('Session created but no data returned');

      console.log('Workout session created:', sessionData.id);

      // Create workout_exercises records
      const workoutExercises = exercises.map((ex, index) => ({
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
        throw new Error(`Workout exercises insert failed: ${workoutExError.message}`);
      }

      console.log('Workout exercises created:', workoutExData?.length);

      // Map exercise_id to workout_exercise_id
      const idMap: Record<string, string> = {};
      workoutExData?.forEach(item => {
        idMap[item.exercise_id] = item.id;
      });

      return { sessionId: sessionData.id, exerciseIds: idMap };
    } catch (err: any) {
      console.error('Error creating workout session:', err);
      throw err;
    }
  };

  // Handle set submission
  const handleSetSubmit = async (setData: { weight_kg: number; reps: number; rpe: number }) => {
    if (typeof window === 'undefined') return;

    setSubmitting(true);
    try {
      let currentWorkoutExerciseIds = workoutExerciseIds;
      
      // If no session exists, create it now (first set)
      if (!workoutSessionId) {
        const result = await createWorkoutSession();
        if (!result) throw new Error('Failed to create workout session');
        
        setWorkoutSessionId(result.sessionId);
        setWorkoutExerciseIds(result.exerciseIds);
        currentWorkoutExerciseIds = result.exerciseIds; // Use returned value immediately
        
        console.log('Session created on first set:', result.sessionId);
      }

      const currentExercise = exercises[currentExerciseIndex];
      const workoutExerciseId = currentWorkoutExerciseIds[currentExercise.exercise_id];
      
      if (!workoutExerciseId) {
        throw new Error(`workout_exercise_id not found for exercise: ${currentExercise.exercise_id}`);
      }
      
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
      const newSets = [
        ...currentSets,
        { id: data.id, set_number: setNumber, ...setData },
      ];
      
      setCompletedSets(prev => ({
        ...prev,
        [currentExerciseIndex]: newSets,
      }));

      // Show rest timer if:
      // 1. Not the last set of target sets AND
      // 2. Not the last exercise OR not all sets completed
      const isLastExercise = currentExerciseIndex === exercises.length - 1;
      const reachedTargetSets = setNumber >= currentExercise.target_sets;
      
      if (!reachedTargetSets || !isLastExercise) {
        setShowRestTimer(true);
      }

    } catch (err) {
      console.error('Error logging set:', err);
      setError('Failed to log set. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle rest timer completion/skip
  const handleRestTimerClose = () => {
    setShowRestTimer(false);
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

  // Save workout progress (without completing)
  const saveWorkoutProgress = async () => {
    if (!workoutSessionId || typeof window === 'undefined') return;

    try {
      const supabase = getSupabaseBrowserClient();

      // Calculate totals from completed sets
      const allSets = Object.values(completedSets).flat();
      const totalSets = allSets.length;
      const totalReps = allSets.reduce((sum, set) => sum + set.reps, 0);
      const totalVolume = allSets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);

      // Update session WITHOUT completed_at (workout still in progress)
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          total_sets: totalSets,
          total_reps: totalReps,
          total_volume_kg: totalVolume,
        })
        .eq('id', workoutSessionId);

      if (error) throw error;

      console.log('Workout progress saved:', { totalSets, totalReps, totalVolume });
    } catch (err) {
      console.error('Error saving workout progress:', err);
      // Don't block navigation even if save fails
    }
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

      // Update session WITH completed_at (workout finished)
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

      // Navigate to summary
      router.push(`/workout/${templateId}/summary`);

    } catch (err) {
      console.error('Error finishing workout:', err);
      setError('Failed to finish workout.');
    }
  };

  // Handle back button (exit workout)
  const handleBackClick = () => {
    // If no session created yet (no sets logged), just navigate back
    if (!workoutSessionId) {
      console.log('No sets logged, navigating back without confirmation');
      router.push('/workout'); // Navigate to workout template list
      return;
    }

    // Has sets - show confirmation
    setConfirmDialog({
      show: true,
      title: 'Exit Workout',
      message: 'Your progress will be saved. You can resume later from your workout history.',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        
        // Save progress before exiting
        await saveWorkoutProgress();
        
        router.push('/'); // Navigate to home
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workout...</p>
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

      {/* Rest Timer */}
      <RestTimer
        isOpen={showRestTimer}
        restSeconds={currentExercise.rest_seconds}
        onComplete={handleRestTimerClose}
        onSkip={handleRestTimerClose}
      />

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

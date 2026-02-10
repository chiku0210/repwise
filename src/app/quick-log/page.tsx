'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExercisePicker from '@/components/exercise-picker';
import { ArrowLeft, Plus } from 'lucide-react';

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
  exercise_id: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number | '';
  reps: number | '';
  rpe: number | '';
}

export default function QuickLogPage() {
  const router = useRouter();
  const [showExercisePicker, setShowExercisePicker] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [currentSet, setCurrentSet] = useState<WorkoutSet>({
    id: crypto.randomUUID(),
    exercise_id: '',
    exercise_name: '',
    set_number: 1,
    weight_kg: '',
    reps: '',
    rpe: '',
  });

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSet({
      ...currentSet,
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      set_number: 1,
    });
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

  return (
    <div className="min-h-screen bg-[#0a1628] pb-20">
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

      {/* Main Content */}
      <div className="p-4">
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
          // Exercise selected - show set logging form (to be implemented)
          <div>
            <div className="mb-4 rounded-lg bg-[#0f1c2e] p-4">
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

            {/* TODO: Add set logging form here */}
            <div className="rounded-lg bg-[#0f1c2e] p-8 text-center">
              <p className="text-gray-400">Set logging form coming soon...</p>
              <p className="mt-2 text-sm text-gray-500">
                Next: Add weight, reps, and RPE inputs
              </p>
            </div>
          </div>
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

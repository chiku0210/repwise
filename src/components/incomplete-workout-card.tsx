'use client';

import { Clock, Play, Trash2 } from 'lucide-react';
import { formatWorkoutDate, formatTime } from '@/lib/utils';

interface IncompleteWorkoutCardProps {
  workout: {
    id: string;
    workout_name: string;
    started_at: string;
    total_sets: number;
    total_volume_kg: number;
    exercises: {
      name: string;
    }[];
  };
  onResume?: (workoutId: string) => void;
  onDiscard?: (workoutId: string) => void;
}

export default function IncompleteWorkoutCard({ 
  workout, 
  onResume, 
  onDiscard 
}: IncompleteWorkoutCardProps) {
  const formattedDate = formatWorkoutDate(workout.started_at);
  const formattedTime = formatTime(workout.started_at);
  
  // Get first 3 exercise names
  const exerciseNames = workout.exercises.map(ex => ex.name);
  const displayExercises = exerciseNames.slice(0, 3).join(', ');
  const remainingCount = exerciseNames.length - 3;
  const exerciseText = remainingCount > 0 
    ? `${displayExercises} +${remainingCount} more`
    : displayExercises;

  return (
    <div className="rounded-lg bg-[#0f1c2e] border-2 border-yellow-800/50 shadow-lg shadow-yellow-900/10">
      <div className="p-4">
        {/* Header with Badge */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">{workout.workout_name}</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700">
                In Progress
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Started {formattedDate}</span>
              <span>•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
          {workout.total_sets > 0 && (
            <span className="font-medium">{workout.total_sets} sets completed</span>
          )}
          {workout.total_sets === 0 && (
            <span className="font-medium text-gray-500">No sets logged yet</span>
          )}
          {workout.total_volume_kg > 0 && (
            <>
              <span className="text-gray-500">•</span>
              <span>{workout.total_volume_kg.toLocaleString()} kg</span>
            </>
          )}
        </div>

        {/* Exercise List */}
        {exerciseText && (
          <div className="text-sm text-gray-400 mb-4">
            {exerciseText}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onResume?.(workout.id)}
            disabled
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            Resume
          </button>
          <button
            onClick={() => onDiscard?.(workout.id)}
            disabled
            className="flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Disabled Notice */}
        <p className="text-xs text-gray-500 text-center mt-2">
          Resume & Discard features coming in Phase 2
        </p>
      </div>
    </div>
  );
}

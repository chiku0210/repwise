'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, TrendingUp } from 'lucide-react';
import { formatWorkoutDate, formatTime, formatExerciseList } from '@/lib/utils';
import WorkoutDetail from './workout-detail';

interface WorkoutCardProps {
  workout: {
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
  };
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const exerciseNames = workout.exercises.map((ex) => ex.name);
  const formattedDate = formatWorkoutDate(workout.completed_at);
  const formattedTime = formatTime(workout.completed_at);
  const exerciseListText = formatExerciseList(exerciseNames, 3);

  return (
    <div className="rounded-lg bg-[#0f1c2e] border border-gray-800">
      {/* Clickable Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 text-left transition-colors hover:bg-[#152235]"
      >
        {/* Date and Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              {formattedDate}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{formattedTime}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{workout.duration} min</span>
          </div>
          <span>•</span>
          <span>{workout.total_sets} sets</span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>{workout.total_volume_kg.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Exercise List */}
        <div className="text-sm text-gray-300">
          {exerciseListText}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-800 px-4 pb-4">
          <WorkoutDetail exercises={workout.exercises} />
        </div>
      )}
    </div>
  );
}

'use client';

import { capitalizeFirst } from '@/lib/utils';

interface WorkoutDetailProps {
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
}

export default function WorkoutDetail({ exercises }: WorkoutDetailProps) {
  return (
    <div className="space-y-4 pt-4">
      {exercises.map((exercise, idx) => (
        <div key={idx} className="space-y-2">
          {/* Exercise Header */}
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">{exercise.name}</h4>
            <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
              {capitalizeFirst(exercise.equipment_type)}
            </span>
          </div>

          {/* Sets List */}
          <div className="space-y-1 pl-3">
            {exercise.sets.map((set) => (
              <div
                key={set.set_number}
                className="flex items-center justify-between text-sm text-gray-300"
              >
                <span className="text-gray-500">Set {set.set_number}</span>
                <span className="flex-1 px-4">
                  {set.weight_kg}kg × {set.reps} reps
                </span>
                <span className="rounded-full bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-400">
                  RPE {set.rpe}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

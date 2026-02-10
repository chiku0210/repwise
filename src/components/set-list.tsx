'use client';

import { Trash2, Edit2 } from 'lucide-react';

interface WorkoutSet {
  id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number;
}

interface SetListProps {
  sets: WorkoutSet[];
  onDelete?: (setId: string) => void;
  onEdit?: (set: WorkoutSet) => void;
}

export default function SetList({ sets, onDelete, onEdit }: SetListProps) {
  if (sets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">Logged Sets</h3>
      
      <div className="space-y-2">
        {sets.map((set) => (
          <div
            key={set.id}
            className="flex items-center justify-between rounded-lg bg-[#0a1628] p-4 ring-1 ring-gray-700"
          >
            {/* Set Info */}
            <div className="flex items-center gap-4">
              {/* Set Number */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20 text-sm font-bold text-green-400">
                {set.set_number}
              </div>
              
              {/* Set Details */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-white">{set.weight_kg}</span>
                  <span className="text-gray-500">kg</span>
                </div>
                <span className="text-gray-600">×</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-white">{set.reps}</span>
                  <span className="text-gray-500">reps</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-gray-400">RPE</span>
                  <span className="text-lg font-semibold text-white">{set.rpe}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(set)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-colors"
                    aria-label="Edit set"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(set.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
                    aria-label="Delete set"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg bg-blue-900/10 px-4 py-3 text-sm">
        <span className="text-gray-400">Total Sets</span>
        <span className="font-semibold text-blue-400">{sets.length}</span>
      </div>
    </div>
  );
}

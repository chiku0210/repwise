'use client';

import { Trash2 } from 'lucide-react';

interface WorkoutSet {
  id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe: number;
}

interface SetListProps {
  sets: WorkoutSet[];
  onDelete: (setId: string) => void;
}

export default function SetList({ sets, onDelete }: SetListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Logged Sets</h3>
      {sets.map((set) => (
        <div
          key={set.id}
          className="flex items-center justify-between rounded-lg bg-[#0f1c2e] p-4 transition-all hover:bg-[#152235]"
        >
          <div className="flex items-center gap-4">
            {/* Set Number */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/30 text-sm font-bold text-blue-400">
              {set.set_number}
            </div>

            {/* Set Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-white">
                <span className="font-semibold">{set.weight_kg} kg</span>
                <span className="text-gray-500">×</span>
                <span className="font-semibold">{set.reps} reps</span>
              </div>
              <div className="text-xs text-gray-400">
                RPE: <span className="text-blue-400 font-medium">{set.rpe}</span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(set.id)}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
            aria-label="Delete set"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}

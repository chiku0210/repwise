'use client';

import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface LoggedSetItemProps {
  setNumber: number;
  weight_kg: number;
  reps: number;
  rpe: number;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function LoggedSetItem({
  setNumber,
  weight_kg,
  reps,
  rpe,
  onEdit,
  onDelete,
  showActions = true,
}: LoggedSetItemProps) {
  // RPE color coding
  const getRPEColor = (rpeValue: number): string => {
    if (rpeValue <= 3) return 'text-green-400 bg-green-900/20';
    if (rpeValue <= 5) return 'text-blue-400 bg-blue-900/20';
    if (rpeValue <= 7) return 'text-yellow-400 bg-yellow-900/20';
    if (rpeValue <= 9) return 'text-orange-400 bg-orange-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  return (
    <div className="bg-[#0f1c2e] rounded-lg p-4 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors">
      {/* Left: Set Info */}
      <div className="flex items-center gap-4 flex-1">
        {/* Check Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
        </div>

        {/* Set Number */}
        <div className="flex-shrink-0">
          <div className="text-xs text-gray-500">SET</div>
          <div className="text-lg font-bold text-white">{setNumber}</div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-gray-700" />

        {/* Weight */}
        <div>
          <div className="text-xs text-gray-500">WEIGHT</div>
          <div className="text-lg font-bold text-white">{weight_kg} kg</div>
        </div>

        {/* Multiplication symbol */}
        <div className="text-gray-600 font-bold text-xl">×</div>

        {/* Reps */}
        <div>
          <div className="text-xs text-gray-500">REPS</div>
          <div className="text-lg font-bold text-white">{reps}</div>
        </div>

        {/* RPE Badge */}
        <div className={`px-3 py-1 rounded-full ${getRPEColor(rpe)} font-semibold text-sm`}>
          RPE {rpe}
        </div>
      </div>

      {/* Right: Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Edit set"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Delete set"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

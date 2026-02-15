'use client';

import { Dumbbell, Clock, RotateCcw } from 'lucide-react';

interface ExerciseHeaderProps {
  exerciseName: string;
  targetSets: number;
  repsRange: string;
  restSeconds: number;
  completedSets: number;
  equipmentType?: string;
}

export function ExerciseHeader({
  exerciseName,
  targetSets,
  repsRange,
  restSeconds,
  completedSets,
  equipmentType,
}: ExerciseHeaderProps) {
  // Format rest time (e.g., "90" -> "1 min 30 sec")
  const formatRestTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  return (
    <div className="space-y-4">
      {/* Exercise Name & Equipment */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{exerciseName}</h1>
        {equipmentType && (
          <p className="text-sm text-gray-400 capitalize flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4" />
            {equipmentType}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Target Sets */}
        <div className="bg-[#0f1c2e] rounded-lg p-3 border border-gray-800">
          <div className="text-xs text-gray-400 mb-1">Target Sets</div>
          <div className="text-lg font-bold text-white">
            {completedSets}/{targetSets}
          </div>
        </div>

        {/* Reps Range */}
        <div className="bg-[#0f1c2e] rounded-lg p-3 border border-gray-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Reps
          </div>
          <div className="text-lg font-bold text-white">{repsRange}</div>
        </div>

        {/* Rest Time */}
        <div className="bg-[#0f1c2e] rounded-lg p-3 border border-gray-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Rest
          </div>
          <div className="text-sm font-bold text-white">{formatRestTime(restSeconds)}</div>
        </div>
      </div>
    </div>
  );
}

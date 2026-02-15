'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentExercise: number; // 1-indexed
  totalExercises: number;
}

export function ProgressBar({ currentExercise, totalExercises }: ProgressBarProps) {
  const progressPercentage = ((currentExercise - 1) / totalExercises) * 100;

  return (
    <div className="space-y-2">
      {/* Text Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Exercise <span className="text-white font-semibold">{currentExercise}</span> of {totalExercises}
        </span>
        <span className="text-gray-400">
          {Math.round(progressPercentage)}% complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Exercise Dots (only show if <= 10 exercises) */}
      {totalExercises <= 10 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {Array.from({ length: totalExercises }).map((_, index) => {
            const exerciseNumber = index + 1;
            const isCompleted = exerciseNumber < currentExercise;
            const isCurrent = exerciseNumber === currentExercise;

            return (
              <div key={index} className="relative">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" fill="currentColor" />
                ) : isCurrent ? (
                  <Circle className="w-4 h-4 text-blue-400" fill="currentColor" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-700" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

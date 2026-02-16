'use client';

import { Clock, Calendar, TrendingUp, Dumbbell } from 'lucide-react';
import { formatWorkoutDate, formatTime } from '@/lib/utils';

interface ResumeWorkoutDialogProps {
  show: boolean;
  workoutName: string;
  startedAt: string;
  totalSets: number;
  totalVolumeKg: number;
  exerciseNames: string[];
  onResume: () => void;
  onStartFresh: () => void;
  onCancel: () => void;
}

export default function ResumeWorkoutDialog({
  show,
  workoutName,
  startedAt,
  totalSets,
  totalVolumeKg,
  exerciseNames,
  onResume,
  onStartFresh,
  onCancel,
}: ResumeWorkoutDialogProps) {
  if (!show) return null;

  const formattedDate = formatWorkoutDate(startedAt);
  const formattedTime = formatTime(startedAt);
  const exerciseText = exerciseNames.slice(0, 3).join(', ');
  const moreCount = exerciseNames.length - 3;

  // Calculate days ago
  const daysAgo = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const timeAgoText = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onCancel} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f1c2e] border-2 border-yellow-800/50 rounded-xl shadow-2xl shadow-yellow-900/20 max-w-md w-full">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-900/30 rounded-lg">
                <Dumbbell className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Incomplete Workout Found</h2>
                <p className="text-sm text-gray-400">Started {timeAgoText}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Workout Name */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{workoutName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="bg-[#152235] rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">Your Progress</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-bold">{totalSets}</span>
                  <span className="text-sm text-gray-400">sets logged</span>
                </div>
                {totalVolumeKg > 0 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold">{totalVolumeKg.toLocaleString()} kg</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Exercises */}
            {exerciseNames.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Exercises</h4>
                <p className="text-sm text-gray-300">
                  {exerciseText}
                  {moreCount > 0 && (
                    <span className="text-gray-500"> +{moreCount} more</span>
                  )}
                </p>
              </div>
            )}

            {/* Message */}
            <p className="text-sm text-gray-400 bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
              💡 <span className="font-medium">Resume</span> to continue where you left off, or <span className="font-medium">Start Fresh</span> to begin a new workout.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={onStartFresh}
              className="flex-1 bg-gray-800 text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-700 transition-all active:scale-[0.98]"
            >
              Start Fresh
            </button>
            <button
              onClick={onResume}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
            >
              Resume Workout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

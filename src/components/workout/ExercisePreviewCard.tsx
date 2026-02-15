import { Timer, Repeat } from 'lucide-react';

interface Exercise {
  exercise_id: string;
  exercise_name: string;
  target_sets: number;
  reps_range: string;
  rest_seconds: number;
  order_index: number;
  notes?: string;
}

interface ExercisePreviewCardProps {
  exercise: Exercise;
  index: number;
}

export function ExercisePreviewCard({ exercise, index }: ExercisePreviewCardProps) {
  const formatRestTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds > 0) {
      return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="rounded-lg p-4 bg-background border border-gray-700">
      {/* Exercise Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-1">
            {exercise.exercise_name}
          </h4>
          {exercise.notes && (
            <p className="text-xs text-gray-400 mb-2">{exercise.notes}</p>
          )}
          
          {/* Exercise Details */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5" />
              <span>
                {exercise.target_sets} Sets × {exercise.reps_range} Reps
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              <span>{formatRestTime(exercise.rest_seconds)} rest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

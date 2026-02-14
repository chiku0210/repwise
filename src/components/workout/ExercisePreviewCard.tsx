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
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {/* Exercise Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">
            {exercise.exercise_name}
          </h4>
          {exercise.notes && (
            <p className="text-xs text-muted-foreground">{exercise.notes}</p>
          )}
        </div>
      </div>

      {/* Exercise Details */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Repeat className="w-4 h-4" />
          <span>
            {exercise.target_sets} × {exercise.reps_range}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Timer className="w-4 h-4" />
          <span>{formatRestTime(exercise.rest_seconds)} rest</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Exercise } from '@/lib/types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  primaryMuscleNames?: string[];
}

const EQUIPMENT_ICONS: Record<string, string> = {
  barbell: '🏋️',
  dumbbell: '💪',
  machine: '⚙️',
  bodyweight: '🧘',
  cable: '🔗',
  other: '🎯',
};

export function ExerciseCard({ exercise, primaryMuscleNames }: ExerciseCardProps) {
  return (
    <Link href={`/learn/exercise/${exercise.id}`}>
      <div className="group cursor-pointer rounded-lg bg-[#0f1e33] p-4 shadow-lg transition-all hover:bg-[#152844] hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {exercise.name}
            </h3>
            {primaryMuscleNames && primaryMuscleNames.length > 0 && (
              <p className="mt-1 text-sm text-gray-400">
                {primaryMuscleNames.join(', ')}
              </p>
            )}
          </div>
          <div className="ml-3 flex items-center gap-2">
            <span className="text-2xl" title={exercise.equipment_type}>
              {EQUIPMENT_ICONS[exercise.equipment_type] || EQUIPMENT_ICONS.other}
            </span>
            {exercise.is_compound && (
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                Compound
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

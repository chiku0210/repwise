import { Clock, Dumbbell } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_minutes: number;
  exercise_count: number;
  equipment: string[];
}

interface TemplateCardProps {
  template: WorkoutTemplate;
  onSelect: (templateId: string) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className="w-full rounded-lg p-4 text-left transition-all bg-[#0a1628] hover:bg-[#152235] hover:ring-2 hover:ring-blue-500 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1">{template.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
            {template.description}
          </p>
          
          {/* Metadata row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{template.exercise_count} exercises</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{template.estimated_duration_minutes} min</span>
            </div>
          </div>
        </div>

        {/* Right side - Badges */}
        <div className="flex flex-col items-end gap-2">
          <DifficultyBadge difficulty={template.difficulty} />
          {template.equipment.length > 0 && (
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
              {template.equipment.length} {template.equipment.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

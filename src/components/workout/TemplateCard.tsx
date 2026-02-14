import { DifficultyBadge } from './DifficultyBadge';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration_minutes: number;
    exercise_count: number;
    equipment: string[];
  };
  onSelect: (templateId: string) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className="w-full bg-muted border border-border rounded-lg p-4 space-y-3 text-left hover:bg-muted/80 transition active:scale-[0.98]"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
            <DifficultyBadge difficulty={template.difficulty} />
            <span>•</span>
            <span>{template.estimated_duration_minutes} min</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {template.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <span>{template.exercise_count} exercises</span>
        {template.equipment.length > 0 && (
          <>
            <span>•</span>
            <span>{template.equipment.slice(0, 2).join(', ')}</span>
            {template.equipment.length > 2 && (
              <span>+{template.equipment.length - 2} more</span>
            )}
          </>
        )}
      </div>
    </button>
  );
}

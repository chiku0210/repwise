import { Clock, Dumbbell, ChevronRight } from 'lucide-react';
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
  const displayEquipment = template.equipment.slice(0, 2);
  const remainingCount = template.equipment.length - 2;

  return (
    <button
      onClick={() => onSelect(template.id)}
      className="w-full text-left bg-card hover:bg-card/80 border border-border rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <DifficultyBadge difficulty={template.difficulty} />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{template.estimated_duration_minutes} min</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {template.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Dumbbell className="w-4 h-4 text-primary" />
          <span>{template.exercise_count} exercises</span>
        </div>
        
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {displayEquipment.map((equipment, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {equipment}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = {
    beginner: 'bg-green-500/10 text-green-400',
    intermediate: 'bg-blue-500/10 text-blue-400',
    advanced: 'bg-orange-500/10 text-orange-400',
  };

  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  );
}

export interface Muscle {
  id: string;
  name: string;
  group: 'push' | 'pull' | 'legs';
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'other';
  equipment_type: 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'other';
  primary_muscles: string[]; // UUID array
  secondary_muscles: string[]; // UUID array
  form_cues: string[];
  variant_of: string | null;
  is_compound: boolean;
  created_at: string;
}

export interface ExerciseWithMuscles extends Exercise {
  primary_muscle_names?: string[];
  secondary_muscle_names?: string[];
}

// Muscle group categories for the Learn tab
export interface MuscleGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Chest',
    emoji: '💪',
    color: 'from-blue-500 to-blue-600',
    description: 'Pecs, push movements',
  },
  {
    id: 'back',
    name: 'Back',
    emoji: '🏋️',
    color: 'from-green-500 to-green-600',
    description: 'Lats, upper back, pull movements',
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    emoji: '🤸',
    color: 'from-yellow-500 to-yellow-600',
    description: 'Delts, overhead movements',
  },
  {
    id: 'arms',
    name: 'Arms',
    emoji: '💪',
    color: 'from-purple-500 to-purple-600',
    description: 'Biceps, triceps, forearms',
  },
  {
    id: 'legs',
    name: 'Legs',
    emoji: '🦵',
    color: 'from-red-500 to-red-600',
    description: 'Quads, hamstrings, glutes, calves',
  },
  {
    id: 'core',
    name: 'Core',
    emoji: '🧘',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Abs, obliques, lower back',
  },
];

// Map muscle names to categories
export const MUSCLE_TO_CATEGORY: Record<string, string> = {
  // Chest
  Chest: 'chest',
  
  // Back
  'Upper Back': 'back',
  Lats: 'back',
  Traps: 'back',
  
  // Shoulders
  'Front Delts': 'shoulders',
  'Side Delts': 'shoulders',
  'Rear Delts': 'shoulders',
  
  // Arms
  Biceps: 'arms',
  Triceps: 'arms',
  Forearms: 'arms',
  
  // Legs
  Quads: 'legs',
  Hamstrings: 'legs',
  Glutes: 'legs',
  Calves: 'legs',
  'Hip Flexors': 'legs',
  Adductors: 'legs',
  Abductors: 'legs',
  
  // Core
  Abs: 'core',
  Core: 'core',
};

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';
export type TrainingSplit = 'ppl' | 'upper_lower' | 'full_body' | 'custom';
export type FitnessGoal = 'strength' | 'hypertrophy' | 'endurance' | 'general_fitness' | 'weight_loss';

export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  experience_level: ExperienceLevel;
  primary_goal: FitnessGoal | null;
  training_frequency: number;
  preferred_split: TrainingSplit | null;
  weight_unit: WeightUnit;
  height_unit: HeightUnit;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  notes: string | null;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_name: string;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  total_sets: number;
  total_reps: number;
  total_volume_kg: number;
  notes: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'other';
  muscle_groups: string[];
  equipment: string[];
  equipment_type: string;
  is_compound: boolean;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  sets_completed: number;
  target_sets: number;
  notes: string | null;
}

export interface ExerciseSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  rest_seconds: number | null;
  rpe: number | null; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface WorkoutStats {
  total_workouts: number;
  current_streak: number;
  days_active: number;
  total_volume_kg: number;
  favorite_exercises: { exercise_name: string; count: number }[];
  last_workout_date: string | null;
}
export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: '0-6 months training' },
  { value: 'intermediate', label: 'Intermediate', description: '6 months - 2 years' },
  { value: 'advanced', label: 'Advanced', description: '2+ years consistent training' },
] as const;

export const FITNESS_GOALS = [
  { value: 'strength', label: 'Strength', icon: '💪' },
  { value: 'hypertrophy', label: 'Muscle Growth', icon: '🏋️' },
  { value: 'endurance', label: 'Endurance', icon: '🏃' },
  { value: 'general_fitness', label: 'General Fitness', icon: '✨' },
  { value: 'weight_loss', label: 'Weight Loss', icon: '📉' },
] as const;

export const TRAINING_SPLITS = [
  { value: 'ppl', label: 'Push/Pull/Legs', description: '3-6 days/week' },
  { value: 'upper_lower', label: 'Upper/Lower', description: '4 days/week' },
  { value: 'full_body', label: 'Full Body', description: '3 days/week' },
  { value: 'custom', label: 'Custom Split', description: 'Your own routine' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
] as const;

export const HEIGHT_UNITS = [
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'ft_in', label: 'Feet/Inches' },
] as const;

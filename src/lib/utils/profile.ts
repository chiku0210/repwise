/**
 * Profile utility functions for calculations and formatting
 */

/**
 * Calculate BMI from height and weight
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return 0;
  }
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Get BMI category and color
 */
export function getBMICategory(bmi: number): {
  category: string;
  color: string;
} {
  if (bmi === 0) return { category: 'N/A', color: 'text-gray-400' };
  if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-400' };
  if (bmi < 25) return { category: 'Normal', color: 'text-green-400' };
  if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
  return { category: 'Obese', color: 'text-red-400' };
}

/**
 * Generate initials from name or email
 */
export function getInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return '??';

  // Remove email domain if present
  const name = nameOrEmail.split('@')[0];

  // Split by space, dot, or underscore
  const parts = name.split(/[\s._-]+/).filter(Boolean);

  if (parts.length === 0) return '??';
  if (parts.length === 1) {
    // Single word - take first 2 chars
    return parts[0].slice(0, 2).toUpperCase();
  }

  // Multiple words - take first char of first 2 words
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Calculate weight progress percentage
 */
export function calculateWeightProgress(
  current: number,
  target: number,
  initial?: number
): number {
  if (!current || !target) return 0;
  const start = initial || current;
  if (start === target) return 100;

  const totalChange = target - start;
  const currentChange = current - start;
  const progress = (currentChange / totalChange) * 100;

  return Math.min(Math.max(progress, 0), 100);
}

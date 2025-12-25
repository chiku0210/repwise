/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

/**
 * Convert centimeters to feet and inches
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert feet and inches to centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return totalInches * 2.54;
}

/**
 * Calculate BMI from weight (kg) and height (cm)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-400' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-400' };
  return { label: 'Obese', color: 'text-red-400' };
}

/**
 * Format weight with unit
 */
export function formatWeight(
  weightKg: number,
  unit: 'kg' | 'lbs',
  decimals: number = 1
): string {
  const weight = unit === 'lbs' ? kgToLbs(weightKg) : weightKg;
  return `${weight.toFixed(decimals)} ${unit}`;
}

/**
 * Format height with unit
 */
export function formatHeight(
  heightCm: number,
  unit: 'cm' | 'ft_in'
): string {
  if (unit === 'ft_in') {
    const { feet, inches } = cmToFeetInches(heightCm);
    return `${feet}'${inches}"`;
  }
  return `${heightCm.toFixed(0)} cm`;
}

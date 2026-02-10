import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper: capitalize first letter
export function capitalizeFirst(input: string): string {
  if (!input) return '';
  return input.charAt(0).toUpperCase() + input.slice(1);
}
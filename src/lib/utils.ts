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

// Format date with hybrid approach:
// "Today", "Yesterday", "X days ago" (up to 7 days), then "Feb 10, 2026"
export function formatWorkoutDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Reset time to midnight for accurate day comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate difference in calendar days
  const diffMs = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;

  // Format as "Feb 10, 2026"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time as "2:30 PM"
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Calculate duration in minutes between two timestamps
export function calculateDuration(startedAt: string, completedAt: string): number {
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60)); // exact minutes
}

// Format exercise list: "Exercise 1 • Exercise 2 • Exercise 3" or "Exercise 1 • Exercise 2 • + 3 more"
export function formatExerciseList(exercises: string[], maxDisplay: number = 3): string {
  if (exercises.length <= maxDisplay) {
    return exercises.join(' • ');
  }
  
  const displayed = exercises.slice(0, maxDisplay).join(' • ');
  const remaining = exercises.length - maxDisplay;
  return `${displayed} • +${remaining} more`;
}

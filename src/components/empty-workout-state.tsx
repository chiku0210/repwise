'use client';

import { useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';

export default function EmptyWorkoutState() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-900/20">
        <Dumbbell className="h-12 w-12 text-blue-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-white">No Workouts Yet</h2>
      <p className="mb-8 max-w-sm text-gray-400">
        Start your first workout to see your training history here
      </p>
      <button
        onClick={() => router.push('/quick-log')}
        className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors active:scale-95"
      >
        Log First Workout
      </button>
    </div>
  );
}

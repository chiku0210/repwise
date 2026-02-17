'use client';

import { useRouter } from 'next/navigation';
import { Dumbbell, Zap } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Start Workout */}
      <button
        onClick={() => router.push('/workout')}
        className="flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center shadow-lg shadow-blue-600/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95"
      >
        <div className="rounded-lg bg-white/10 p-2">
          <Dumbbell className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Start</p>
          <p className="text-sm font-semibold text-white">Workout</p>
        </div>
      </button>

      {/* Quick Log */}
      <button
        onClick={() => router.push('/quick-log')}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-blue-600/50 bg-blue-600/10 p-6 text-center transition-all hover:border-blue-600 hover:bg-blue-600/20 active:scale-95"
      >
        <div className="rounded-lg bg-blue-500/20 p-2">
          <Zap className="h-6 w-6 text-blue-400" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-400">Quick</p>
          <p className="text-sm font-semibold text-blue-400">Log</p>
        </div>
      </button>
    </div>
  );
}

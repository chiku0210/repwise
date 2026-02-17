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
        className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/30 active:scale-95"
      >
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="relative rounded-full bg-white/15 p-3 ring-2 ring-white/20 transition-transform group-hover:scale-110">
          <Dumbbell className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="relative">
          <p className="text-base font-bold text-white">Start Workout</p>
        </div>
      </button>

      {/* Quick Log */}
      <button
        onClick={() => router.push('/quick-log')}
        className="group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-blue-600/50 bg-blue-600/10 p-6 transition-all hover:border-blue-600 hover:bg-blue-600/20 active:scale-95"
      >
        <div className="rounded-full bg-blue-500/20 p-3 ring-2 ring-blue-500/30 transition-transform group-hover:scale-110">
          <Zap className="h-7 w-7 text-blue-400" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-base font-bold text-blue-400">Quick Log</p>
        </div>
      </button>
    </div>
  );
}

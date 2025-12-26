'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';
import { MUSCLE_GROUPS } from '@/lib/types/exercise';

export default function LearnPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Learn</h1>
            <p className="text-sm text-gray-400">
              Browse exercises by muscle group
            </p>
          </div>

          {/* Muscle Group Grid */}
          <div className="grid grid-cols-2 gap-4">
            {MUSCLE_GROUPS.map((group) => (
              <Link
                key={group.id}
                href={`/learn/${group.id}`}
                className="group"
              >
                <div
                  className={`rounded-lg bg-gradient-to-br ${group.color} p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                >
                  <div className="text-center">
                    <div className="mb-2 text-4xl">{group.emoji}</div>
                    <h3 className="text-lg font-bold text-white">
                      {group.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80">
                      {group.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Card */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-sm text-gray-300">
              💡 <span className="font-semibold">Tip:</span> Focus on compound
              movements for maximum gains. Each exercise includes detailed form
              cues.
            </p>
          </div>
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

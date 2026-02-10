'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';
import { MUSCLE_GROUPS, IMG_PLACEHOLDER, ICON_PLACEHOLDER } from '@/lib/types/exercise';

interface MuscleCardProps {
  group: {
    id: string;
    name: string;
    description: string;
  };
}

function MuscleCard({ group }: MuscleCardProps) {
  return (
    <Link href={`/learn/${group.id}`}>
      <div className="group relative h-64 overflow-hidden rounded-2xl border border-white/5 bg-[#0f1e33] p-6 shadow-xl shadow-black/50 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20">
        {/* Placeholder for muscle group image */}
        <div className="mb-4 flex h-32 items-center justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/50">
            <div className="text-blue-400/40 text-sm font-mono">{IMG_PLACEHOLDER}</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-blue-400">
            {group.name}
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">{group.description}</p>
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <svg
            className="h-6 w-6 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-8 p-6">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">Learn</h1>
            <p className="text-base text-gray-400">
              Browse exercises by muscle group and master your form
            </p>
          </div>

          {/* Muscle Group Grid - 2 columns for mobile-first */}
          <div className="grid grid-cols-2 gap-4">
            {MUSCLE_GROUPS.map((group) => (
              <MuscleCard key={group.id} group={group} />
            ))}
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-blue-500/20 bg-[#0f1e33] p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-xl font-mono text-blue-400/60">{ICON_PLACEHOLDER}</div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Pro Tip</p>
                <p className="text-sm leading-relaxed text-gray-300">
                  Focus on compound movements for maximum gains. Each exercise
                  includes detailed form cues to help you lift safely and
                  effectively.
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';

export default function LearnPage() {
  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Learn</h1>
            <p className="text-sm text-gray-400">Improve your form and technique</p>
          </div>

          <div className="rounded-lg bg-[#0f1e33] p-8 text-center shadow-lg">
            <p className="text-gray-400">Educational content coming soon.</p>
          </div>
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

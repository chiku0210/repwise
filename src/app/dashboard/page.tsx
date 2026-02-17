'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthGate } from '@/components/AuthGate';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';
import { RecentWorkouts } from '@/components/dashboard/RecentWorkouts';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col bg-[#0a1628]">
        <main className="flex-1 pb-24">
          <div className="mx-auto max-w-2xl space-y-6 p-6">
            <WelcomeHeader />
            <QuickActions />
            <WeeklyStats />
            <RecentWorkouts />
          </div>
        </main>

        {/* Footer with Privacy Policy link - positioned above BottomNav */}
        <footer className="border-t border-gray-800 bg-[#0f1e33] px-4 py-3 pb-24">
          <div className="mx-auto max-w-md text-center">
            <p className="text-xs text-gray-400">
              © 2025 Repwise
            </p>
            <div className="mt-1 flex justify-center gap-3 text-xs text-gray-500">
              <a href="/privacy" className="transition-colors hover:text-blue-400">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="mailto:chiku0210@gmail.com" className="transition-colors hover:text-blue-400">
                Contact
              </a>
            </div>
          </div>
        </footer>

        <BottomNav />
      </div>
    </AuthGate>
  );
}

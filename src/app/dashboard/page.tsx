'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { AppFooter } from '@/components/ui/AppFooter';
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

        <AppFooter />
        <BottomNav />
      </div>
    </AuthGate>
  );
}

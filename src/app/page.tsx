'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { AuthGate } from '@/components/AuthGate';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <AuthGate>
      <main className="min-h-screen pb-20">
        <div className="mx-auto max-w-md space-y-6 p-6">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Repwise</h1>
            <p className="text-sm text-muted-foreground">
              Every rep counts! <br />
              Log your training and build strength with intent.
            </p>
            {user && <p className="text-xs text-gray-400">Welcome, {user.email}</p>}
          </div>

          <div className="space-y-4">
            <Button size="lg" className="h-14 w-full text-lg">
              Start Workout
            </Button>
            <Button variant="outline" size="lg" className="h-14 w-full text-lg">
              Quick Log
            </Button>
          </div>
        </div>

        <BottomNav />
      </main>
    </AuthGate>
  );
}

'use client';

import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { AuthGate } from '@/components/AuthGate';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-md space-y-6 p-6">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Repwise</h1>
              <p className="text-muted-foreground text-sm">
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
        </main>

        {/* Footer with Privacy Policy link - positioned above BottomNav */}
        <footer className="border-t border-gray-800 bg-[#0f1e33] px-4 py-3 pb-24">
          <div className="mx-auto max-w-md text-center">
            <p className="text-xs text-gray-400">
              © 2025 Repwise
            </p>
            <div className="mt-1 flex justify-center gap-3 text-xs text-gray-500">
              <a href="/privacy" className="hover:text-blue-400">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="mailto:chiku0210@gmail.com" className="hover:text-blue-400">
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

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f1e33] px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Repwise</h1>
          <button
            onClick={signOut}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome, {user.email}!</h2>
            <p className="text-gray-400">Your workout tracking journey starts here.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Today</h3>
              <p className="text-gray-400">Log your workout</p>
            </div>
            <div className="rounded-lg bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">History</h3>
              <p className="text-gray-400">View past workouts</p>
            </div>
            <div className="rounded-lg bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Learn</h3>
              <p className="text-gray-400">Exercise guides</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0f1e33] px-4 py-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-400">
            © 2025 Repwise. Every rep counts.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
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
    </div>
  );
}

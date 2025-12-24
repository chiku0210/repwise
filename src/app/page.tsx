'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          {/* Logo/Title */}
          <h1 className="mb-4 text-5xl font-bold text-white">Repwise</h1>
          <p className="mb-8 text-xl text-gray-300">
            Every rep counts!
            <br />
            Log your training and build strength with intent.
          </p>

          {/* Features */}
          <div className="mb-12 grid gap-6 text-left md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Track Workouts</h3>
              <p className="text-sm text-gray-400">
                Log every exercise, set, and rep with ease. Build your training history.
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Monitor Progress</h3>
              <p className="text-sm text-gray-400">
                Visualize your gains over time. See your strength improvements.
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-[#0f1e33] p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Learn & Grow</h3>
              <p className="text-sm text-gray-400">
                Access exercise guides and form tips. Train smart, not just hard.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/login"
            className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get Started - Sign In with Google
          </Link>
        </div>
      </main>

      {/* Footer with Privacy Policy */}
      <footer className="border-t border-gray-800 bg-[#0f1e33] px-4 py-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-400">© 2025 Repwise. Every rep counts.</p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>
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

'use client';

import { useAuth } from '@/hooks/useAuth';
import { Dumbbell } from 'lucide-react';

export function WelcomeHeader() {
  const { user } = useAuth();

  // Extract first name from email or use 'there'
  const getName = () => {
    if (!user?.email) return 'there';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {getGreeting()}, {getName()}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-400">Ready to make every rep count?</p>
      </div>

      {/* App Branding */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-[#0f1e33] p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
          <Dumbbell className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Repwise</p>
          <p className="text-xs text-gray-400">Your strength training companion</p>
        </div>
      </div>
    </div>
  );
}

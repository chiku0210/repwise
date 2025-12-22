'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sendOtp = async () => {
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'http://localhost:3000', // update to prod later
        },
      });
      if (error) throw error;
      setPhase('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      if (data.session) {
        router.push('/'); // go to home after login
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">Sign in</h1>

        {phase === 'email' ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border px-3 py-2"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="h-11 w-full rounded-md bg-blue-600 text-white disabled:opacity-60"
            >
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Enter the code sent to <span className="font-medium">{email}</span>
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full rounded-md border px-3 py-2 tracking-[0.3em]"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length === 0}
              className="h-11 w-full rounded-md bg-blue-600 text-white disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & Sign in'}
            </button>
          </>
        )}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </main>
  );
}

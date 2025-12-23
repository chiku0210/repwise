'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined,
        },
      });

      if (error) throw error;

      setMessage('Check your email for the 6-digit OTP code');
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined,
        },
      });

      if (error) throw error;

      setMessage('New OTP sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a1628] px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Repwise</h1>
          <p className="text-gray-400">
            Every rep counts!
            <br />
            Log your training and build strength with intent.
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-lg bg-[#0f1e33] p-6 shadow-xl">
          {step === 'email' ? (
            <form onSubmit={handleSendOtp}>
              <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-gray-600 bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-md border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-md border border-blue-800 bg-blue-900/30 px-4 py-3 text-sm text-blue-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1e33] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="mb-2 text-xl font-semibold text-white">Verify OTP</h2>
              <p className="mb-6 text-sm text-gray-400">
                Enter the code sent to <strong>{email}</strong>
              </p>

              <div className="mb-4">
                <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-300">
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  disabled={loading}
                  maxLength={6}
                  className="w-full rounded-md border border-gray-600 bg-[#0a1628] px-4 py-3 text-center text-2xl tracking-widest text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-md border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-md border border-blue-800 bg-blue-900/30 px-4 py-3 text-sm text-blue-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1e33] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setError(null);
                    setMessage(null);
                  }}
                  disabled={loading}
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          We'll send you a 6-digit code to sign in.
          <br />
          No passwords needed.
        </p>
      </div>
    </div>
  );
}

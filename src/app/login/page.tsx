'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
      // User will be redirected to Google OAuth flow
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
    }
  };

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

      router.push('/dashboard');
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a1628] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
        >
          ← Back to home
        </Link>

        {/* Logo/Title */}
        <div className="mb-8 text-center">
          {/* Dumbbell Icon */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg shadow-blue-500/20">
              <Dumbbell className="h-12 w-12 text-white" strokeWidth={2} />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-white">Repwise</h1>
          <p className="text-sm text-gray-400">
            Every rep counts!
            <br />
            Log your training and build strength with intent.
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-xl border border-gray-800 bg-[#0f1e33] p-6 shadow-xl">
          {step === 'email' ? (
            <>
              <h2 className="mb-6 text-xl font-semibold text-white">Sign In</h2>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-600 bg-white px-4 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1e33] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0f1e33] px-3 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email OTP Form */}
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
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
                    className="w-full rounded-lg border border-gray-700 bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mb-4 rounded-lg border border-blue-800/50 bg-blue-900/20 px-4 py-3 text-sm text-blue-300">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1e33] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="mb-2 text-xl font-semibold text-white">Verify OTP</h2>
              <p className="mb-6 text-sm text-gray-400">
                Enter the code sent to <strong className="text-gray-300">{email}</strong>
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
                  className="w-full rounded-lg border border-gray-700 bg-[#0a1628] px-4 py-3 text-center text-2xl tracking-widest text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-lg border border-blue-800/50 bg-blue-900/20 px-4 py-3 text-sm text-blue-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1e33] disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="text-gray-400 transition-colors hover:text-white disabled:opacity-50"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-400 transition-colors hover:text-blue-300 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          {step === 'email'
            ? "Sign in with Google or we'll send you a 6-digit code."
            : 'Enter the 6-digit code sent to your email.'}
          <br />
          No passwords needed.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LandingHeader } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ValueProps } from '@/components/landing/ValueProps';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show nothing while checking auth (prevents flash)
  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      <LandingHeader />
      <main className="flex-1">
        <Hero />
        <ValueProps />
      </main>
      <Footer />
    </div>
  );
}

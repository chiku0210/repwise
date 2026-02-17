import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export function Hero() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        {/* Dumbbell Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6">
            <Dumbbell className="h-16 w-16 text-white md:h-20 md:w-20" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-5xl font-bold tracking-tight text-white md:text-7xl">
          Repwise
        </h1>

        {/* Tagline */}
        <p className="mb-3 text-2xl font-medium text-blue-400 md:text-3xl">
          Every rep counts!
        </p>

        {/* Subtitle */}
        <p className="mb-10 text-lg leading-relaxed text-gray-300">
          Log your training and build strength with intent.
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="inline-flex h-14 items-center gap-2 rounded-xl bg-blue-600 px-8 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95 active:bg-blue-800 md:h-16 md:px-10"
        >
          Get Started with Google
        </Link>
      </div>
    </section>
  );
}

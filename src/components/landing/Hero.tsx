import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export function Hero() {
  return (
    <section className="px-6 py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        {/* Dumbbell Icon */}
        <div className="mb-6 flex justify-center md:mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg shadow-blue-500/20 md:p-6">
            <Dumbbell className="h-20 w-20 text-white md:h-24 md:w-24 lg:h-28 lg:w-28" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-5xl font-bold leading-tight tracking-tight text-white md:mb-3 md:text-6xl lg:text-7xl">
          Repwise
        </h1>

        {/* Tagline */}
        <p className="mb-2 text-xl font-semibold text-blue-400 md:text-2xl lg:text-3xl">
          Every rep counts!
        </p>

        {/* Subtitle */}
        <p className="mb-8 text-base leading-relaxed text-gray-300 md:mb-10 md:text-lg">
          Log your training and build strength with intent.
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="inline-flex h-14 items-center gap-2 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 active:bg-blue-800 md:h-16 md:px-10 md:text-lg"
        >
          Get Started with Google
        </Link>
      </div>
    </section>
  );
}

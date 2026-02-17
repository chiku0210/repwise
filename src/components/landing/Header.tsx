import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-gray-800/50 bg-[#0a1628]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-white">Repwise</h1>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-400"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}

import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-gray-800/50 bg-[#0a1628]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-white">Repwise</h1>
        <Link
          href="/login"
          className="rounded-lg border border-blue-600/50 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:border-blue-600 hover:bg-blue-600/20 hover:text-blue-300"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}

import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-800 bg-[#0f1e33] px-6 py-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm text-gray-400">© 2026 Repwise. Every rep counts.</p>
        <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="transition-colors hover:text-blue-400">
            Privacy Policy
          </Link>
          <span>•</span>
          <a
            href="mailto:chiku0210@gmail.com"
            className="transition-colors hover:text-blue-400"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

/**
 * Reusable footer for authenticated app pages (dashboard, log, learn, profile)
 * Positioned above BottomNav with pb-24 to prevent overlap
 */
export function AppFooter() {
  return (
    <footer className="border-t border-gray-800 bg-[#0f1e33] px-4 py-3 pb-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs text-gray-400">© 2025 Repwise</p>
        <div className="mt-1 flex justify-center gap-3 text-xs text-gray-500">
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

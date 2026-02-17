import Link from 'next/link';

interface FooterProps {
  variant?: 'landing' | 'app';
}

/**
 * Unified footer component for both landing pages and authenticated app pages
 * 
 * @param variant - 'landing' for public pages (default), 'app' for authenticated pages with BottomNav
 */
export function Footer({ variant = 'landing' }: FooterProps) {
  const isApp = variant === 'app';

  return (
    <footer
      className={`border-t border-gray-800 bg-[#0f1e33] ${
        isApp ? 'px-4 py-3 pb-24' : 'px-6 py-8'
      }`}
    >
      <div className={`mx-auto text-center ${
        isApp ? 'max-w-md' : 'max-w-6xl'
      }`}>
        <p className={isApp ? 'text-xs text-gray-400' : 'text-sm text-gray-400'}>
          © {new Date().getFullYear()} Repwise{!isApp && '. Every rep counts.'}
        </p>
        <div className={`flex justify-center ${
          isApp ? 'mt-1 gap-3 text-xs' : 'mt-2 gap-4 text-xs'
        } text-gray-500`}>
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

// Legacy export for backward compatibility
export { Footer as LandingFooter };

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Dumbbell, BookOpen, User } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Today', icon: Home },
  { href: '/log', label: 'Log', icon: Dumbbell },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      // Today includes: dashboard (home), workout flows, and quick-log
      return (
        pathname === '/' || 
        pathname === '/dashboard' || 
        pathname.startsWith('/workout') || 
        pathname.startsWith('/quick-log')
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 border-t">
      <div className="mx-auto flex h-16 max-w-md items-center px-4">
        <div className="flex w-full space-x-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="group flex flex-1 flex-col items-center gap-1 rounded-lg p-2"
              >
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-colors',
                    active ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  )}
                  fill={active ? 'currentColor' : 'none'}
                  strokeWidth={active ? 0 : 2}
                />
                <span 
                  className={cn(
                    'text-xs transition-colors',
                    active ? 'text-blue-400 font-semibold' : 'text-gray-400'
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

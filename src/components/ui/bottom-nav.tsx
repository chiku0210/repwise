'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Dumbbell, BookOpen, User } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Today', icon: Home },
  { href: '/log', label: 'Log', icon: Dumbbell },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <nav className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 border-t">
      <div className="mx-auto flex h-16 max-w-md items-center px-4">
        <div className="flex w-full space-x-4">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-1 flex-col items-center gap-1 rounded-lg p-2"
            >
              <Icon className="group-hover:text-primary h-5 w-5" />
              <span className="text-muted-foreground text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

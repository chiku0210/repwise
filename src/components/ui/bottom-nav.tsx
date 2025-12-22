'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, Dumbbell, BookOpen, User } from 'lucide-react'

const items = [
  { href: '/', label: 'Today', icon: Home },
  { href: '/log', label: 'Log', icon: Dumbbell },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center">
        <div className="w-full flex space-x-4">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg group"
            >
              <Icon className="h-5 w-5 group-hover:text-primary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

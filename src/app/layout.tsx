import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Repwise',
  description:
    'Every rep counts. A focused gym-coach PWA for logging workouts and learning better form.',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global Width Constraint - Mobile-first PWA */}
        <div className="mx-auto max-w-md min-h-screen bg-background relative">
          {children}
        </div>
      </body>
    </html>
  );
}

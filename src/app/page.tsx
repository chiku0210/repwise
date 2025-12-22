import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md space-y-6 p-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Repwise</h1>
          <p className="text-muted-foreground text-sm">
            Every rep counts! <br />
            Log your training and build strength with intent.
          </p>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="h-14 w-full text-lg">
            Start Workout
          </Button>
          <Button variant="outline" size="lg" className="h-14 w-full text-lg">
            Quick Log
          </Button>
          <Link href="/login" className="block text-center text-sm text-blue-600 underline">
            Sign in with email
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    // Prevent usage during build / SSR
    throw new Error('Supabase browser client must be used client-side only')
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase URL and anon key are required. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  return createBrowserClient(url, key)
}

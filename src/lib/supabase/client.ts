import { createBrowserClient } from '@supabase/ssr'

// Browser client — used in 'use client' components (like axios instance in React)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

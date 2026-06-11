// Server Component layout — like a NestJS Guard + interceptor combined; runs before every dashboard route
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // getUser() — server-validated; equivalent to NestJS JwtAuthGuard extracting user from token
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug, subscription_tier')
    .eq('owner_id', user.id)
    .single()

  // No business row = onboarding incomplete; redirect instead of showing blank dashboard
  if (!business) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-gray-900">{business.name}</span>
            <nav className="hidden sm:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Overview
              </Link>
              <Link href="/dashboard/branches" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Branches
              </Link>
              <Link href="/dashboard/staff" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Staff
              </Link>
              <Link href="/dashboard/services" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Services
              </Link>
              <Link href="/dashboard/availability" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                Availability
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium capitalize">
              {business.subscription_tier}
            </span>
            {/* Server Action in form — logout can't be called via onClick in a Server Component */}
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import { DashboardNav } from '@/components/DashboardNav'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Calendar, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  // getUser() validates JWT server-side — equivalent to NestJS JwtAuthGuard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug, subscription_tier')
    .eq('owner_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-ink-950">
      <header className="bg-white dark:bg-ink-900 border-b border-stone-200 dark:border-ink-800 border-t-2 border-t-ember-500 shadow-sm sticky top-0 z-10">
        <div className="px-6">
          <div className="h-16 flex items-center gap-3">
            {/* Product wordmark */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-white" strokeWidth={2} />
              </div>
              <span className="font-semibold text-base text-stone-900 dark:text-white tracking-tight">BookFlow</span>
            </div>
            {/* Divider */}
            <div className="h-6 w-px bg-stone-200 dark:bg-ink-700 shrink-0" />
            {/* Workspace name + tier badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-medium text-sm text-stone-700 dark:text-stone-300 max-w-[140px] truncate">
                {business.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  business.subscription_tier === 'pro'
                    ? 'bg-ember-100 dark:bg-ember-500/20 text-ember-700 dark:text-ember-400'
                    : 'bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-400'
                }`}
              >
                {business.subscription_tier === 'pro' ? 'Pro' : 'Free'}
              </span>
            </div>
            {/* Nav — client component owns its own icons (can't pass icon functions as props from Server) */}
            <DashboardNav />
            {/* Theme toggle */}
            <ThemeToggle />
            {/* Logout — ghost style */}
            <form action={logout} className="shrink-0">
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

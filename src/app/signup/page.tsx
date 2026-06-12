import { signup } from '@/app/auth/actions'
import { PasswordInput } from '@/components/PasswordInput'
import { SubmitButton } from '@/components/SubmitButton'
import { Calendar, Check } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  // Next.js 14: searchParams is a plain sync prop (becomes async in Next.js 15+)
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel — always dark, premium feel regardless of site theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-ember-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BM.com</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold text-white tracking-tight leading-snug mb-4">
            Run your bookings on autopilot.
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Branches, staff schedules, deposits, and subscriptions — all in one
            clean dashboard built for modern service businesses.
          </p>

          <div className="space-y-3">
            {[
              'Real-time booking with double-booking prevention',
              'Stripe-powered subscriptions & deposits',
              'Multi-branch, multi-staff scheduling',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-mint-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-mint-400" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-stone-500">
          © {new Date().getFullYear()} BM.com. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-stone-50 dark:bg-ink-950">
        <div className="w-full max-w-md">
          {/* Mobile brand (hidden on desktop, shown when brand panel is hidden) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-stone-900 dark:text-white tracking-tight">BM.com</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Start managing bookings in minutes</p>
          </div>

          {searchParams.error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <svg className="mt-0.5 shrink-0 text-red-500" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-red-700 dark:text-red-400">{searchParams.error}</p>
            </div>
          )}

          {/* Server Action — form posts directly to action; no fetch, no API route, unlike NestJS controllers */}
          <form action={signup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-stone-200 dark:border-ink-700 rounded-xl text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 bg-white dark:bg-ink-900 focus:outline-none focus:ring-2 focus:ring-ember-500/30 focus:border-ember-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Password
              </label>
              <PasswordInput
                name="password"
                placeholder="Min. 6 characters"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Confirm password
              </label>
              <PasswordInput
                name="confirmPassword"
                placeholder="Re-enter your password"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="pt-1">
              <SubmitButton loadingText="Creating account...">
                Create account →
              </SubmitButton>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-stone-900 dark:text-white hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-6">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

import { resetPassword } from '@/app/auth/actions'
import { PasswordInput } from '@/components/PasswordInput'
import { SubmitButton } from '@/components/SubmitButton'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-ember-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BM.com</span>
        </div>

        <div className="bg-ink-900 rounded-2xl border border-ink-700 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Set a new password</h1>
            <p className="text-sm text-stone-400 mt-1">Must be at least 6 characters</p>
          </div>

          {searchParams.error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <svg className="mt-0.5 shrink-0 text-red-400" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-red-400">{searchParams.error}</p>
            </div>
          )}

          {/* Server Action — session exists via /auth/callback PKCE exchange; updateUser reads it from cookies */}
          <form action={resetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1.5">
                New password
              </label>
              <PasswordInput
                name="password"
                placeholder="Min. 6 characters"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="pt-1">
              <SubmitButton loadingText="Updating password...">
                Update password
              </SubmitButton>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-stone-400">
            <Link href="/login" className="font-semibold text-white hover:underline underline-offset-2">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

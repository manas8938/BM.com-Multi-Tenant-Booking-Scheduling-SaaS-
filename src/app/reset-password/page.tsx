import { resetPassword } from '@/app/auth/actions'
import { PasswordInput } from '@/components/PasswordInput'
import { SubmitButton } from '@/components/SubmitButton'
import Link from 'next/link'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
                <path d="M5 2v3M11 2v3M2 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-stone-900 tracking-tight">BM.com</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Set a new password</h1>
            <p className="text-sm text-stone-500 mt-1">Must be at least 6 characters</p>
          </div>

          {searchParams.error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <svg className="mt-0.5 shrink-0 text-red-500" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-red-700">{searchParams.error}</p>
            </div>
          )}

          {/* Server Action — session exists via /auth/callback PKCE exchange; updateUser reads it from cookies */}
          <form action={resetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
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

          <p className="mt-6 text-center text-sm text-stone-500">
            <Link href="/login" className="font-semibold text-stone-900 hover:underline underline-offset-2">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

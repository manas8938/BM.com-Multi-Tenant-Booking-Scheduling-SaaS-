import { resetPassword } from '@/app/auth/actions'
import { PasswordInput } from '@/components/PasswordInput'
import Link from 'next/link'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        {/* Server Action — session was established by /auth/callback; updateUser reads it from cookies */}
        <form action={resetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <PasswordInput
              name="password"
              placeholder="Min. 6 characters"
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Update password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-black hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

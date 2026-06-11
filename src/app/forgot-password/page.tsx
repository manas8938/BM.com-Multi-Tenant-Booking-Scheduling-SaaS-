import { forgotPassword } from '@/app/auth/actions'
import Link from 'next/link'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-1">
            We&apos;ll send a reset link to your email
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        {searchParams.sent ? (
          <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            Check your email — a reset link is on its way.
          </div>
        ) : (
          <form action={forgotPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-black hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

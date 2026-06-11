import { signup } from '@/app/auth/actions'
import { PasswordInput } from '@/components/PasswordInput'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start managing bookings in minutes</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        {/* Server Action — form posts directly to action, no client-side fetch or API route needed */}
        <form action={signup} className="space-y-4">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            {/* PasswordInput is 'use client' — Server Component can include Client Components */}
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
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

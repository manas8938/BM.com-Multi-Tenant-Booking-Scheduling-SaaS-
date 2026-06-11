import { createBusiness } from './actions'

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up your business</h1>
          <p className="text-sm text-gray-500 mt-1">This takes 30 seconds</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        <form action={createBusiness} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Anas Clinic"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Booking URL slug
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
              <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-300 whitespace-nowrap">
                bookflow.app/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                pattern="[a-zA-Z0-9-]+"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="anas-clinic"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Letters, numbers, hyphens only</p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors mt-2"
          >
            Create business →
          </button>
        </form>
      </div>
    </div>
  )
}

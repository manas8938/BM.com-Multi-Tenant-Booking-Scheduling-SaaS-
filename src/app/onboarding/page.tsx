import { createBusiness } from './actions'

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <div className="mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Set up your business</h1>
          <p className="text-sm text-stone-500 mt-1">This takes 30 seconds</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        <form action={createBusiness} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
              Business name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Anas Clinic"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-stone-700 mb-1">
              Booking URL slug
            </label>
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
              <span className="px-3 py-2 bg-stone-50 text-stone-400 text-sm border-r border-stone-300 whitespace-nowrap">
                bookflow.app/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                pattern="[a-zA-Z0-9-]+"
                className="flex-1 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                placeholder="anas-clinic"
              />
            </div>
            <p className="mt-1 text-xs text-stone-400">Letters, numbers, hyphens only</p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all mt-2"
          >
            Create business →
          </button>
        </form>
      </div>
    </div>
  )
}

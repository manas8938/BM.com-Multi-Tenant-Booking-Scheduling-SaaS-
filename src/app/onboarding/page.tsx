import { createBusiness } from './actions'
import { Calendar } from 'lucide-react'

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-ember-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-mint-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BM.com</span>
        </div>

        <div className="bg-ink-900/80 backdrop-blur-sm rounded-2xl border border-ink-700 p-8 shadow-2xl shadow-black/40">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Set up your business</h1>
            <p className="text-sm text-stone-400 mt-1">This takes 30 seconds</p>
          </div>

          {searchParams.error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {searchParams.error}
            </div>
          )}

          <form action={createBusiness} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1.5">
                Business name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-ink-700 rounded-xl text-sm text-white placeholder:text-stone-500 bg-ink-950 focus:outline-none focus:ring-2 focus:ring-ember-500/30 focus:border-ember-500 transition-colors"
                placeholder="Anas Clinic"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-stone-300 mb-1.5">
                Booking URL slug
              </label>
              <div className="flex items-center border border-ink-700 rounded-xl overflow-hidden bg-ink-950 focus-within:ring-2 focus-within:ring-ember-500/30 focus-within:border-ember-500 transition-colors">
                <span className="px-4 py-3 bg-ink-900 text-stone-500 text-sm border-r border-ink-700 whitespace-nowrap">
                  bm.com/
                </span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9-]+"
                  className="flex-1 px-4 py-3 text-sm text-white placeholder:text-stone-500 bg-transparent focus:outline-none"
                  placeholder="anas-clinic"
                />
              </div>
              <p className="mt-1.5 text-xs text-stone-500">Letters, numbers, hyphens only</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-ember-600 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all mt-2"
            >
              Create business →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

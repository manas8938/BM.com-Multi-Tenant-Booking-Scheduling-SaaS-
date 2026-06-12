// loading.tsx — Next.js automatically shows this while the Server Component fetches data
// Equivalent to a NestJS interceptor that shows a placeholder before the response arrives
export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Page header skeleton */}
      <div className="mb-8">
        <div className="h-7 w-28 bg-stone-200 dark:bg-ink-700 rounded-lg" />
        <div className="h-4 w-56 bg-stone-100 dark:bg-ink-700/60 rounded-md mt-2" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-24 bg-stone-100 dark:bg-ink-700/60 rounded" />
              <div className="w-8 h-8 bg-stone-100 dark:bg-ink-700/60 rounded-lg" />
            </div>
            <div className="h-9 w-12 bg-stone-200 dark:bg-ink-700 rounded-lg" />
            <div className="h-3 w-16 bg-stone-100 dark:bg-ink-700/60 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Manage cards */}
      <div>
        <div className="h-3 w-16 bg-stone-100 dark:bg-ink-700/60 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-stone-100 dark:bg-ink-700/60 rounded-xl" />
                <div className="w-4 h-4 bg-stone-100 dark:bg-ink-700/60 rounded" />
              </div>
              <div className="h-4 w-20 bg-stone-200 dark:bg-ink-700 rounded" />
              <div className="h-3 w-28 bg-stone-100 dark:bg-ink-700/60 rounded mt-2" />
              <div className="h-3 w-12 bg-stone-100 dark:bg-ink-700/60 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

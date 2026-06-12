export default function ServicesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-24 bg-stone-200 dark:bg-ink-700 rounded-lg" />
          <div className="h-4 w-52 bg-stone-100 dark:bg-ink-700/60 rounded-md mt-2" />
        </div>
        <div className="h-10 w-32 bg-stone-200 dark:bg-ink-700 rounded-lg" />
      </div>

      <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm overflow-hidden">
        <div className="flex gap-6 px-5 py-3.5 border-b border-stone-100 dark:border-ink-700 bg-stone-50 dark:bg-ink-900/40">
          <div className="h-3 w-24 bg-stone-200 dark:bg-ink-700 rounded" />
          <div className="h-3 w-16 bg-stone-200 dark:bg-ink-700 rounded" />
          <div className="h-3 w-12 bg-stone-200 dark:bg-ink-700 rounded" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-stone-100 dark:border-ink-700 last:border-0">
            <div className="h-4 w-36 bg-stone-200 dark:bg-ink-700 rounded" />
            <div className="h-4 w-12 bg-stone-100 dark:bg-ink-700/60 rounded" />
            <div className="h-4 w-16 bg-stone-100 dark:bg-ink-700/60 rounded" />
            <div className="flex gap-2 ml-auto">
              <div className="w-7 h-7 bg-stone-100 dark:bg-ink-700/60 rounded-lg" />
              <div className="w-7 h-7 bg-stone-100 dark:bg-ink-700/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AvailabilityLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-60 bg-gray-100 rounded-md mt-2" />
      </div>

      {/* Staff selector card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Add slot form card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="h-5 w-40 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      {/* Slots table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-5 py-3.5 border-b border-gray-100 last:border-0">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="ml-auto w-7 h-7 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

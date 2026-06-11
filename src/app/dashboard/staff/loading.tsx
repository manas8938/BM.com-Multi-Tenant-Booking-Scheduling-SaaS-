export default function StaffLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-16 bg-gray-200 rounded-lg" />
          <div className="h-4 w-44 bg-gray-100 rounded-md mt-2" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex gap-6 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-gray-100 last:border-0">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="flex gap-2 ml-auto">
              <div className="w-7 h-7 bg-gray-100 rounded-lg" />
              <div className="w-7 h-7 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

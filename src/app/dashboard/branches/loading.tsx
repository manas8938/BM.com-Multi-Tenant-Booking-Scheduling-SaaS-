export default function BranchesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          <div className="h-4 w-48 bg-gray-100 rounded-md mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex gap-6 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        {/* Table rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-gray-100 rounded-lg" />
              <div className="w-7 h-7 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

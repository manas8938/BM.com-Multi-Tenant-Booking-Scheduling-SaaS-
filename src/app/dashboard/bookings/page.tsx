import { Calendar } from 'lucide-react'
import Link from 'next/link'

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Bookings</h1>
        <p className="text-sm text-stone-500 mt-0.5">View and manage customer bookings</p>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 bg-ember-50 rounded-full flex items-center justify-center mb-4">
          <Calendar size={24} className="text-ember-400" />
        </div>
        <p className="font-semibold text-stone-700">No bookings yet</p>
        <p className="text-sm text-stone-400 mt-1 mb-5">
          Set up your public booking page to start receiving bookings
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all"
        >
          Go to Overview
        </Link>
      </div>
    </div>
  )
}

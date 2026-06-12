import { requireBusiness } from '@/lib/supabase/server-utils'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function BookingsPage() {
  const { supabase, business } = await requireBusiness()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, customer_name, customer_email, start_time, status, services(name), staff(name)')
    .eq('business_id', business.id)
    .order('start_time', { ascending: false })

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString([], {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

  function statusStyles(status: string) {
    if (status === 'confirmed') return 'bg-mint-50 text-mint-600'
    if (status === 'cancelled') return 'bg-stone-100 text-stone-500'
    return 'bg-gold-50 text-gold-600'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Bookings</h1>
        <p className="text-sm text-stone-500 mt-0.5">View and manage customer bookings</p>
      </div>

      {(!bookings || bookings.length === 0) ? (
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
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3.5">Customer</th>
                <th className="text-left px-5 py-3.5">Service</th>
                <th className="text-left px-5 py-3.5">Staff</th>
                <th className="text-left px-5 py-3.5">When</th>
                <th className="text-left px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: { id: string; customer_name: string; customer_email: string; start_time: string; status: string; services: { name: string }[]; staff: { name: string }[] }) => (
                <tr key={b.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-stone-900">{b.customer_name}</p>
                    <p className="text-xs text-stone-400">{b.customer_email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-stone-700">{b.services?.[0]?.name}</td>
                  <td className="px-5 py-3.5 text-stone-700">{b.staff?.[0]?.name}</td>
                  <td className="px-5 py-3.5 text-stone-700">{formatDateTime(b.start_time)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

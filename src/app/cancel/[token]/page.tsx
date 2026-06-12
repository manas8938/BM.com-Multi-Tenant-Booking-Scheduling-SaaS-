import { createClient } from '@/lib/supabase/server'
import { cancelBooking } from './actions'
import { Calendar, XCircle, CheckCircle2 } from 'lucide-react'

// Public page — no auth, identified only by the unguessable cancel_token (uuid)
export default async function CancelPage({
  params,
  searchParams,
}: {
  params: { token: string }
  searchParams: { done?: string }
}) {
  const supabase = await createClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, customer_name, start_time, status, services(name), staff(name), businesses(name, slug)')
    .eq('cancel_token', params.token)
    .maybeSingle()

  const business = (booking?.businesses as unknown as { name: string; slug: string }[] | null)?.[0]
  const service = (booking?.services as unknown as { name: string }[] | null)?.[0]
  const staffMember = (booking?.staff as unknown as { name: string }[] | null)?.[0]

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-stone-900 tracking-tight">BM.com</span>
        </div>

        {!booking ? (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-stone-900 mb-1">Booking not found</h1>
            <p className="text-sm text-stone-500">This link is invalid or has expired.</p>
          </div>
        ) : booking.status === 'cancelled' || searchParams.done ? (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-mint-500 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-stone-900 mb-1">Booking cancelled</h1>
            <p className="text-sm text-stone-500">Your appointment has been cancelled successfully.</p>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-stone-900 mb-1">Cancel your booking?</h1>
            <p className="text-sm text-stone-500 mb-4">This action cannot be undone.</p>
            <div className="bg-stone-50 rounded-lg p-4 text-sm space-y-1.5 mb-6">
              <p><span className="text-stone-400">Business:</span> <span className="font-medium text-stone-900">{business?.name}</span></p>
              <p><span className="text-stone-400">Service:</span> <span className="font-medium text-stone-900">{service?.name}</span></p>
              <p><span className="text-stone-400">With:</span> <span className="font-medium text-stone-900">{staffMember?.name}</span></p>
              <p><span className="text-stone-400">When:</span> <span className="font-medium text-stone-900">{new Date(booking.start_time).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></p>
            </div>
            <form action={cancelBooking}>
              <input type="hidden" name="token" value={params.token} />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                Yes, cancel my booking
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

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
          {!booking ? (
            <div className="text-center">
              <XCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
              <h1 className="text-lg font-bold text-white mb-1">Booking not found</h1>
              <p className="text-sm text-stone-400">This link is invalid or has expired.</p>
            </div>
          ) : booking.status === 'cancelled' || searchParams.done ? (
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-mint-400 mx-auto mb-3" />
              <h1 className="text-lg font-bold text-white mb-1">Booking cancelled</h1>
              <p className="text-sm text-stone-400">Your appointment has been cancelled successfully.</p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold text-white mb-1">Cancel your booking?</h1>
              <p className="text-sm text-stone-400 mb-4">This action cannot be undone.</p>
              <div className="bg-ink-950 border border-ink-700 rounded-xl p-4 text-sm space-y-1.5 mb-6">
                <p><span className="text-stone-500">Business:</span> <span className="font-medium text-white">{business?.name}</span></p>
                <p><span className="text-stone-500">Service:</span> <span className="font-medium text-white">{service?.name}</span></p>
                <p><span className="text-stone-500">With:</span> <span className="font-medium text-white">{staffMember?.name}</span></p>
                <p><span className="text-stone-500">When:</span> <span className="font-medium text-white">{new Date(booking.start_time).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></p>
              </div>
              <form action={cancelBooking}>
                <input type="hidden" name="token" value={params.token} />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-red-700 active:scale-[0.98] transition-all"
                >
                  Yes, cancel my booking
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

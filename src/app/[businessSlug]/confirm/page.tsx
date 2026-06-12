import { confirmDepositBooking } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { Check, XCircle, Calendar } from 'lucide-react'

// Landing page after Stripe Checkout redirect — creates the booking server-side from session metadata
export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: { businessSlug: string }
  searchParams: { session_id?: string }
}) {
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('slug', params.businessSlug)
    .single()

  if (!searchParams.session_id) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-ember-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md bg-ink-900/80 backdrop-blur-sm rounded-2xl border border-ink-700 p-8 text-center shadow-2xl shadow-black/40">
          <XCircle className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-white mb-1">Missing session</h1>
          <p className="text-sm text-stone-400">No checkout session found.</p>
        </div>
      </div>
    )
  }

  const result = await confirmDepositBooking(searchParams.session_id)

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-ember-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-mint-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-ink-900/80 backdrop-blur-sm rounded-2xl border border-ink-700 p-8 text-center shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-white tracking-tight">{business?.name ?? 'BM.com'}</span>
        </div>

        {result.success ? (
          <>
            <div className="w-14 h-14 bg-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={26} className="text-mint-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Booking confirmed</h1>
            <p className="text-sm text-stone-400 mb-6">
              Your deposit was received and your appointment is booked.
            </p>
            <a
              href={`/cancel/${result.cancelToken}`}
              className="inline-block text-sm text-stone-400 hover:text-ember-400 underline underline-offset-2 transition-colors"
            >
              Need to cancel? Click here
            </a>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-white mb-1">Something went wrong</h1>
            <p className="text-sm text-stone-400">{result.error}</p>
          </>
        )}
      </div>
    </div>
  )
}

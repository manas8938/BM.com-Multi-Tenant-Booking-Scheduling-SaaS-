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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
          <XCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-stone-900 mb-1">Missing session</h1>
          <p className="text-sm text-stone-500">No checkout session found.</p>
        </div>
      </div>
    )
  }

  const result = await confirmDepositBooking(searchParams.session_id)

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-stone-900 tracking-tight">{business?.name ?? 'BM.com'}</span>
        </div>

        {result.success ? (
          <>
            <div className="w-14 h-14 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={26} className="text-mint-600" />
            </div>
            <h1 className="text-xl font-bold text-stone-900 mb-1">Booking confirmed</h1>
            <p className="text-sm text-stone-500 mb-6">
              Your deposit was received and your appointment is booked.
            </p>
              <a
              href={`/cancel/${result.cancelToken}`}
              className="inline-block text-sm text-stone-400 hover:text-ember-600 underline underline-offset-2 transition-colors"
            >
              Need to cancel? Click here
            </a>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-stone-900 mb-1">Something went wrong</h1>
            <p className="text-sm text-stone-500">{result.error}</p>
          </>
        )}
      </div>
    </div>
  )
}

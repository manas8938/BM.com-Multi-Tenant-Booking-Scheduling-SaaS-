import { requireBusiness } from '@/lib/supabase/server-utils'
import { createCheckoutSession } from './actions'
import { SubmitButton } from '@/components/SubmitButton'
import { CheckCircle2, Crown } from 'lucide-react'

// like NestJS: controller rendering view based on entity state (subscription_tier)
export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const { business } = await requireBusiness()
  const isPro = business.subscription_tier === 'pro'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-1">Billing</h1>
      <p className="text-stone-500 mb-6">Manage your subscription plan.</p>

      {searchParams.success && (
        <div className="mb-6 rounded-lg bg-mint-50 border border-mint-200 text-mint-700 px-4 py-3 text-sm">
          Payment successful! Your plan will update shortly.
        </div>
      )}
      {searchParams.canceled && (
        <div className="mb-6 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 px-4 py-3 text-sm">
          Checkout canceled. No changes made.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Free plan card */}
        <div className={`rounded-xl border p-6 ${!isPro ? 'border-ember-500 ring-1 ring-ember-500' : 'border-stone-200'}`}>
          <h3 className="font-semibold text-ink-900 mb-1">Free</h3>
          <p className="text-2xl font-bold text-ink-900 mb-4">$0<span className="text-sm font-normal text-stone-500">/mo</span></p>
          <ul className="space-y-2 text-sm text-stone-600 mb-4">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> 1 branch</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Up to 3 staff</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Basic booking page</li>
          </ul>
          {!isPro && <span className="text-xs font-medium text-ember-600">Current plan</span>}
        </div>

        {/* Pro plan card */}
        <div className={`rounded-xl border p-6 ${isPro ? 'border-ember-500 ring-1 ring-ember-500' : 'border-stone-200'}`}>
          <h3 className="font-semibold text-ink-900 mb-1 flex items-center gap-1">
            <Crown className="w-4 h-4 text-gold-500" /> Pro
          </h3>
          <p className="text-2xl font-bold text-ink-900 mb-4">$20<span className="text-sm font-normal text-stone-500">/mo</span></p>
          <ul className="space-y-2 text-sm text-stone-600 mb-4">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Unlimited branches</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Unlimited staff</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Realtime booking sync</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600 shrink-0" /> Priority support</li>
          </ul>
          {isPro ? (
            <span className="text-xs font-medium text-ember-600">Current plan</span>
          ) : (
            <form action={createCheckoutSession}>
              <SubmitButton>Upgrade to Pro</SubmitButton>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

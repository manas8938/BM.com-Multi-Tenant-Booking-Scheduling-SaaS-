import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookingFlow } from '@/components/BookingFlow'
export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug')
    .eq('slug', businessSlug)
    .single()
  if (!business) notFound()
  const [{ data: services }, { data: staff }] = await Promise.all([
    supabase
      .from('services')
      .select('id, name, duration_minutes, price_cents, deposit_cents')
      .eq('business_id', business.id)
      .order('name'),
    supabase
      .from('staff')
      .select('id, name')
      .eq('business_id', business.id)
      .order('name'),
  ])
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-ink-950">
      <header className="bg-white dark:bg-ink-900 border-b border-stone-200 dark:border-ink-700 shadow-sm sticky top-0 z-10">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Business identity — logo + name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ember-600 rounded-lg flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5" />
                <path d="M5 2v3M11 2v3M2 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-semibold text-stone-900 dark:text-white text-base leading-tight">{business.name}</p>
          </div>
          {/* "Powered by" badge — mirrors dashboard's BM.com wordmark placement */}
          <span className="text-xs text-stone-400 dark:text-stone-500 font-medium tracking-wide">
            Powered by <span className="text-stone-500 dark:text-stone-400 font-semibold">BM.com</span>
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <BookingFlow
          businessId={business.id}
          businessSlug={business.slug}
          services={services ?? []}
          staff={staff ?? []}
        />
      </main>
    </div>
  )
}

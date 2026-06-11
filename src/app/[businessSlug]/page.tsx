import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookingFlow } from '@/components/BookingFlow'

// Dynamic route segment — [businessSlug] folder name becomes params.businessSlug, like :slug in Express routes
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
      .select('id, name, duration_minutes, price_cents')
      .eq('business_id', business.id)
      .order('name'),
    supabase
      .from('staff')
      .select('id, name')
      .eq('business_id', business.id)
      .order('name'),
  ])

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-ink-900 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="white" strokeWidth="1.5" />
              <path d="M5 2v3M11 2v3M2 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-stone-900 leading-tight">{business.name}</p>
            <p className="text-xs text-stone-400">Powered by BookFlow</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <BookingFlow
          businessId={business.id}
          services={services ?? []}
          staff={staff ?? []}
        />
      </main>
    </div>
  )
}

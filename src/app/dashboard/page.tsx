import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('name, slug, subscription_tier')
    .single()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Your public booking page:{' '}
        <a
          href={`/${business?.slug}`}
          target="_blank"
          className="text-black font-medium hover:underline"
        >
          bookflow.app/{business?.slug}
        </a>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Branches', href: '/dashboard/branches', desc: 'Manage your locations' },
          { label: 'Staff', href: '/dashboard/staff', desc: 'Manage team members' },
          { label: 'Services', href: '/dashboard/services', desc: 'Set pricing & duration' },
        ].map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
          >
            <p className="font-semibold text-gray-900">{card.label}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

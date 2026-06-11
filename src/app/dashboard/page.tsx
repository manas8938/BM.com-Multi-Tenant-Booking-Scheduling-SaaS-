import { requireBusiness } from '@/lib/supabase/server-utils'
import { Calendar, Users, GitBranch, Scissors, ArrowRight, TrendingUp, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const { supabase, business } = await requireBusiness()

  const [
    { count: branchCount },
    { count: staffCount },
    { count: serviceCount },
    { count: bookingCount },
  ] = await Promise.all([
    supabase.from('branches').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('staff').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
  ])

  const stats = [
    { label: 'Total Bookings', value: bookingCount ?? 0, icon: Calendar, sub: 'all time', bg: 'bg-ember-50', text: 'text-ember-600', border: 'border-t-ember-500' },
    { label: 'This Week', value: 0, icon: TrendingUp, sub: 'coming soon', bg: 'bg-mint-50', text: 'text-mint-600', border: 'border-t-mint-500' },
    { label: 'Active Staff', value: staffCount ?? 0, icon: Users, sub: 'team members', bg: 'bg-ink-50', text: 'text-ink-900', border: 'border-t-ink-900' },
    { label: 'Revenue', value: '$0', icon: DollarSign, sub: 'deposits (soon)', bg: 'bg-gold-50', text: 'text-gold-600', border: 'border-t-gold-500' },
  ]

  const manage = [
    { href: '/dashboard/branches', label: 'Branches', icon: GitBranch, count: branchCount ?? 0, desc: 'Manage locations', bg: 'bg-ember-50', text: 'text-ember-600' },
    { href: '/dashboard/staff', label: 'Staff', icon: Users, count: staffCount ?? 0, desc: 'Manage team members', bg: 'bg-mint-50', text: 'text-mint-600' },
    { href: '/dashboard/services', label: 'Services', icon: Scissors, count: serviceCount ?? 0, desc: 'Pricing & duration', bg: 'bg-ink-50', text: 'text-ink-900' },
    { href: '/dashboard/availability', label: 'Availability', icon: Clock, count: 0, desc: 'Weekly schedules', bg: 'bg-gold-50', text: 'text-gold-600' },
  ] as const

  return (
    <div className="space-y-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-2xl font-bold text-stone-900">Overview</h1>
        <p className="text-sm text-stone-500 mt-1">
          Public booking page:{' '}
          <Link
            href={`/${business.slug}`}
            target="_blank"
            className="text-ember-600 hover:underline underline-offset-2 font-medium"
          >
            /{business.slug}
          </Link>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl border border-stone-200 border-t-[3px] ${s.border} shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{s.label}</span>
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                <s.icon size={15} className={s.text} />
              </div>
            </div>
            <p className="text-4xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Manage cards */}
      <div className="animate-fadeInUp">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {manage.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 hover:border-ember-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <item.icon size={20} className={item.text} />
                </div>
                <ArrowRight size={15} className="text-stone-300 group-hover:text-ember-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-semibold text-stone-900">{item.label}</p>
              <p className="text-sm text-stone-500 mt-0.5">{item.desc}</p>
              <p className="text-sm font-semibold text-ember-600 mt-3 hover:underline">
                {item.count} total →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

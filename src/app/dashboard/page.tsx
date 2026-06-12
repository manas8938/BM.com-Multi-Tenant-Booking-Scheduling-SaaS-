import { requireBusiness } from '@/lib/supabase/server-utils'
import { Calendar, Users, GitBranch, Scissors, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const { supabase, business } = await requireBusiness()

  // compute current week's Mon 00:00 -> next Mon 00:00 (like a date-range filter in a NestJS query)
  const now = new Date()
  const day = now.getDay() // 0=Sun..6=Sat
  const diffToMonday = day === 0 ? 6 : day - 1
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - diffToMonday)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  const [
    { count: branchCount },
    { count: staffCount },
    { count: serviceCount },
    { count: bookingCount },
    { count: weekCount },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('branches').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('staff').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('start_time', startOfWeek.toISOString())
      .lt('start_time', endOfWeek.toISOString()),
    supabase
      .from('bookings')
      .select('id, customer_name, start_time, status, services(name), staff(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Total Bookings', value: bookingCount ?? 0, icon: Calendar, sub: 'all time', bg: 'bg-ember-50', text: 'text-ember-600', border: 'border-t-ember-500' },
    { label: 'This Week', value: weekCount ?? 0, icon: TrendingUp, sub: 'Mon - Sun', bg: 'bg-mint-50', text: 'text-mint-600', border: 'border-t-mint-500' },
    { label: 'Active Staff', value: staffCount ?? 0, icon: Users, sub: 'team members', bg: 'bg-ink-50', text: 'text-ink-900', border: 'border-t-ink-900' },
  ]

  const manage = [
    { href: '/dashboard/branches', label: 'Branches', icon: GitBranch, count: branchCount ?? 0, desc: 'Manage locations', bg: 'bg-ember-50', text: 'text-ember-600' },
    { href: '/dashboard/staff', label: 'Staff', icon: Users, count: staffCount ?? 0, desc: 'Manage team members', bg: 'bg-mint-50', text: 'text-mint-600' },
    { href: '/dashboard/services', label: 'Services', icon: Scissors, count: serviceCount ?? 0, desc: 'Pricing & duration', bg: 'bg-ink-50', text: 'text-ink-900' },
    { href: '/dashboard/availability', label: 'Availability', icon: Clock, count: 0, desc: 'Weekly schedules', bg: 'bg-gold-50', text: 'text-gold-600' },
  ] as const

  function statusStyles(status: string) {
    if (status === 'confirmed') return 'bg-mint-50 text-mint-600'
    if (status === 'cancelled') return 'bg-stone-100 text-stone-500'
    return 'bg-gold-50 text-gold-600'
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString([], {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    })
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp">
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

      {/* Recent Bookings */}
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-ember-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          {!recentBookings || recentBookings.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-400">No bookings yet</div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recentBookings.map((b: { id: string; customer_name: string; start_time: string; status: string; services: { name: string }[]; staff: { name: string }[] }) => (
                  <tr key={b.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-stone-900">{b.customer_name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-stone-600">{b.services?.[0]?.name}</td>
                    <td className="px-5 py-3.5 text-stone-600">{b.staff?.[0]?.name}</td>
                    <td className="px-5 py-3.5 text-stone-600">{formatDateTime(b.start_time)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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

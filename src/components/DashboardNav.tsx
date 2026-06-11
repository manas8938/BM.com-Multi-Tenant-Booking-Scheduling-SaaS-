'use client'
// All icon imports + nav logic live here — icons are functions, can't be passed as props from Server Components
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Scissors,
  Clock,
  Calendar,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/branches', label: 'Branches', icon: GitBranch, exact: false },
  { href: '/dashboard/staff', label: 'Staff', icon: Users, exact: false },
  { href: '/dashboard/services', label: 'Services', icon: Scissors, exact: false },
  { href: '/dashboard/availability', label: 'Availability', icon: Clock, exact: false },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar, exact: false },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-ember-50 text-ember-700'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Icon size={15} className={active ? 'text-ember-600' : 'text-stone-400'} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

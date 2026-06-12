import { requireBusiness } from '@/lib/supabase/server-utils'
import { createStaff, updateStaff, deleteStaff } from './actions'
import { SubmitButton } from '@/components/SubmitButton'
import { DeleteButton } from '@/components/DeleteButton'
import { Users, Pencil, Plus } from 'lucide-react'
import Link from 'next/link'

const INPUT = 'w-full px-3.5 py-2.5 bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-600 rounded-lg text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:text-stone-500 focus:outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 transition-colors'
const SELECT = 'w-full px-3.5 py-2.5 bg-white dark:bg-ink-900 border border-stone-300 dark:border-ink-600 rounded-lg text-sm text-stone-900 dark:text-white focus:outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 transition-colors'
const BTN_PRIMARY = 'inline-flex items-center gap-2 px-4 py-2.5 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all'
const BTN_SECONDARY = 'inline-flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-ink-600 rounded-lg hover:bg-stone-50 dark:hover:bg-white/5 transition-colors'

export default async function StaffPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string; error?: string }
}) {
  const { supabase, business } = await requireBusiness()

  const [{ data: staffList }, { data: branches }] = await Promise.all([
    supabase.from('staff').select('*, branches(name)').eq('business_id', business.id).order('created_at', { ascending: true }),
    supabase.from('branches').select('id, name').eq('business_id', business.id).order('name'),
  ])

  const editItem = searchParams.edit ? staffList?.find((s) => s.id === searchParams.edit) : null
  const showForm = !!searchParams.new || !!editItem

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Staff</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Manage your team members</p>
        </div>
        {!showForm && (
          <Link href="?new=1" className={BTN_PRIMARY}>
            <Plus size={16} />
            Add Staff
          </Link>
        )}
      </div>

      {searchParams.error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
          <svg className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm text-red-700 dark:text-red-400">{searchParams.error}</p>
        </div>
      )}

      {showForm && (
        <div className={`bg-white dark:bg-ink-800 rounded-xl border shadow-sm p-6 ${editItem ? 'border-ember-200 dark:border-ember-500/40' : 'border-stone-200 dark:border-ink-700'}`}>
          <h2 className="text-base font-semibold text-stone-900 dark:text-white mb-5">
            {editItem ? 'Edit Staff Member' : 'New Staff Member'}
          </h2>
          <form action={editItem ? updateStaff : createStaff} className="space-y-4">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Full name</label>
                <input name="name" type="text" required placeholder="Dr. Sarah Ahmed" defaultValue={editItem?.name ?? ''} className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
                <input name="email" type="email" required placeholder="sarah@clinic.com" defaultValue={editItem?.email ?? ''} className={INPUT} />
              </div>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Branch <span className="text-stone-400 dark:text-stone-500 font-normal">(optional)</span></label>
              <select name="branch_id" defaultValue={editItem?.branch_id ?? ''} className={SELECT}>
                <option value="">No branch assigned</option>
                {branches?.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-auto">
                <SubmitButton loadingText="Saving...">{editItem ? 'Save Changes' : 'Add Staff Member'}</SubmitButton>
              </div>
              <Link href="/dashboard/staff" className={BTN_SECONDARY}>Cancel</Link>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm overflow-hidden">
        {!staffList?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-ember-50 dark:bg-ember-500/20 rounded-full flex items-center justify-center mb-4">
              <Users size={24} className="text-ember-400" />
            </div>
            <p className="font-semibold text-stone-700 dark:text-stone-300">No staff members yet</p>
            <p className="text-sm text-stone-400 dark:text-stone-500 mt-1 mb-5">Add your first team member to start scheduling</p>
            <Link href="?new=1" className={BTN_PRIMARY}>
              <Plus size={16} />
              Add Staff Member
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 dark:border-ink-700 bg-stone-50/80 dark:bg-ink-900/40">
                <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">Name</th>
                <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">Email</th>
                <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">Branch</th>
                <th className="px-5 py-3.5 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-ink-700">
              {staffList.map((member) => (
                <tr key={member.id} className="hover:bg-stone-50/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-stone-900 dark:text-white">{member.name}</td>
                  <td className="px-5 py-3.5 text-stone-500 dark:text-stone-400">{member.email}</td>
                  <td className="px-5 py-3.5 text-stone-500 dark:text-stone-400">
                    {(member.branches as { name: string } | null)?.name ?? <span className="text-stone-300 dark:text-stone-600">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`?edit=${member.id}`} className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-ember-600 hover:bg-ember-50 dark:hover:bg-ember-500/20 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <form action={deleteStaff}>
                        <input type="hidden" name="id" value={member.id} />
                        <DeleteButton confirm={`Remove "${member.name}" from staff?`} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

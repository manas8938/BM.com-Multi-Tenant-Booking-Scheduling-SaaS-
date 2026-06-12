import { requireBusiness } from '@/lib/supabase/server-utils'
import { createSlot, deleteSlot } from './actions'
import { SubmitButton } from '@/components/SubmitButton'
import { DeleteButton } from '@/components/DeleteButton'
import { Clock, Users, Plus } from 'lucide-react'
import Link from 'next/link'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SELECT = 'w-full px-3.5 py-2.5 border border-stone-300 dark:border-ink-600 rounded-lg text-sm text-stone-900 dark:text-white focus:outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 transition-colors'
const INPUT = 'w-full px-3.5 py-2.5 border border-stone-300 dark:border-ink-600 rounded-lg text-sm text-stone-900 dark:text-white focus:outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 transition-colors'
const BTN_PRIMARY = 'inline-flex items-center gap-2 px-4 py-2.5 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all'

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: { staff?: string; error?: string }
}) {
  const { supabase, business } = await requireBusiness()

  const { data: staffList } = await supabase
    .from('staff').select('id, name').eq('business_id', business.id).order('name')

  const selectedStaff = searchParams.staff ? staffList?.find((s) => s.id === searchParams.staff) : null

  const { data: slots } = selectedStaff
    ? await supabase
        .from('availability_slots')
        .select('*')
        .eq('staff_id', selectedStaff.id)
        .eq('business_id', business.id)
        .order('day_of_week')
        .order('start_time')
    : { data: [] }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Availability</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Set weekly recurring schedules per staff member</p>
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

      {!staffList?.length ? (
        <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 bg-ember-50 dark:bg-ember-500/20 rounded-full flex items-center justify-center mb-4">
            <Users size={24} className="text-ember-400" />
          </div>
          <p className="font-semibold text-stone-700 dark:text-stone-300">No staff members yet</p>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1 mb-5">Add staff first, then set their availability</p>
          <Link href="/dashboard/staff" className={BTN_PRIMARY}>
            <Plus size={16} />
            Go to Staff
          </Link>
        </div>
      ) : (
        <>
          {/* Staff selector */}
          <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm p-5">
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Select staff member</label>
            <div className="flex flex-wrap gap-2">
              {staffList.map((s) => (
                <Link
                  key={s.id}
                  href={`?staff=${s.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedStaff?.id === s.id
                      ? 'bg-ember-600 text-white border-ember-600 shadow-sm'
                      : 'bg-white dark:bg-ink-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-ink-600 hover:border-ember-400 dark:hover:border-ember-500 hover:text-ember-600'
                  }`}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {selectedStaff && (
            <>
              {/* Add slot form */}
              <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm p-6">
                <h2 className="text-base font-semibold text-stone-900 dark:text-white mb-5">
                  Add slot for <span className="text-ember-600">{selectedStaff.name}</span>
                </h2>
                <form action={createSlot} className="space-y-4">
                  <input type="hidden" name="staff_id" value={selectedStaff.id} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Day of week</label>
                      <select name="day_of_week" required className={SELECT}>
                        {DAYS.map((day, i) => (
                          <option key={i} value={i}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Start time</label>
                      <input name="start_time" type="time" required defaultValue="09:00" className={INPUT} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">End time</label>
                      <input name="end_time" type="time" required defaultValue="17:00" className={INPUT} />
                    </div>
                  </div>
                  <div className="w-auto">
                    <SubmitButton loadingText="Adding slot...">
                      <Plus size={15} />
                      Add Slot
                    </SubmitButton>
                  </div>
                </form>
              </div>

              {/* Slots list */}
              <div className="bg-white dark:bg-ink-800 rounded-xl border border-stone-200 dark:border-ink-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100 dark:border-ink-700 bg-stone-50/80 dark:bg-ink-900/40 flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">{selectedStaff.name}&apos;s schedule</p>
                  <span className="text-xs font-medium text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {slots?.length ?? 0} slots
                  </span>
                </div>
                {!slots?.length ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-12 h-12 bg-ember-50 dark:bg-ember-500/20 rounded-full flex items-center justify-center mb-3">
                      <Clock size={20} className="text-ember-300 dark:text-ember-500/50" />
                    </div>
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">No availability set</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Use the form above to add weekly time slots</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 dark:border-ink-700">
                        <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">Day</th>
                        <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">Start</th>
                        <th className="text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide px-5 py-3.5">End</th>
                        <th className="px-5 py-3.5 w-16" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-ink-700">
                      {slots.map((slot) => (
                        <tr key={slot.id} className="hover:bg-stone-50/60 dark:hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-stone-900 dark:text-white">{DAYS[slot.day_of_week]}</td>
                          <td className="px-5 py-3.5 text-stone-600 dark:text-stone-400">{formatTime(slot.start_time)}</td>
                          <td className="px-5 py-3.5 text-stone-600 dark:text-stone-400">{formatTime(slot.end_time)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-end">
                              <form action={deleteSlot}>
                                <input type="hidden" name="id" value={slot.id} />
                                <DeleteButton confirm="Remove this availability slot?" />
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

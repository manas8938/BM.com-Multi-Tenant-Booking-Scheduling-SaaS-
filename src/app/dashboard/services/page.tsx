import { requireBusiness } from '@/lib/supabase/server-utils'
import { createService, updateService, deleteService } from './actions'
import { SubmitButton } from '@/components/SubmitButton'
import { DeleteButton } from '@/components/DeleteButton'
import { Scissors, Pencil, Plus } from 'lucide-react'
import Link from 'next/link'

const INPUT = 'w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 transition-colors'
const BTN_PRIMARY = 'inline-flex items-center gap-2 px-4 py-2.5 bg-ember-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-ember-700 active:scale-[0.98] transition-all'
const BTN_SECONDARY = 'inline-flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors'

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string; error?: string }
}) {
  const { supabase, business } = await requireBusiness()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true })

  const editItem = searchParams.edit ? services?.find((s) => s.id === searchParams.edit) : null
  const showForm = !!searchParams.new || !!editItem

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Services</h1>
          <p className="text-sm text-stone-500 mt-0.5">Set pricing and duration for each service</p>
        </div>
        {!showForm && (
          <Link href="?new=1" className={BTN_PRIMARY}>
            <Plus size={16} />
            Add Service
          </Link>
        )}
      </div>

      {searchParams.error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg className="mt-0.5 shrink-0 text-red-500" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm text-red-700">{searchParams.error}</p>
        </div>
      )}

      {showForm && (
        <div className={`bg-white rounded-xl border shadow-sm p-6 ${editItem ? 'border-ember-200' : 'border-stone-200'}`}>
          <h2 className="text-base font-semibold text-stone-900 mb-5">
            {editItem ? 'Edit Service' : 'New Service'}
          </h2>
          <form action={editItem ? updateService : createService} className="space-y-4">
            {editItem && <input type="hidden" name="id" value={editItem.id} />}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Service name</label>
              <input name="name" type="text" required placeholder="Haircut & Style" defaultValue={editItem?.name ?? ''} className={INPUT} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Duration <span className="text-stone-400 font-normal">(minutes)</span>
                </label>
                <input name="duration_minutes" type="number" required min="5" step="5" placeholder="30" defaultValue={editItem?.duration_minutes ?? ''} className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Price <span className="text-stone-400 font-normal">(USD)</span>
                </label>
                {/* Input in dollars; actions.ts multiplies ×100 to store as cents */}
                <input name="price" type="number" required min="0" step="0.01" placeholder="25.00" defaultValue={editItem ? (editItem.price_cents / 100).toFixed(2) : ''} className={INPUT} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-auto">
                <SubmitButton loadingText="Saving...">{editItem ? 'Save Changes' : 'Create Service'}</SubmitButton>
              </div>
              <Link href="/dashboard/services" className={BTN_SECONDARY}>Cancel</Link>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {!services?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-ember-50 rounded-full flex items-center justify-center mb-4">
              <Scissors size={24} className="text-ember-400" />
            </div>
            <p className="font-semibold text-stone-700">No services yet</p>
            <p className="text-sm text-stone-400 mt-1 mb-5">Add the services your business offers</p>
            <Link href="?new=1" className={BTN_PRIMARY}>
              <Plus size={16} />
              Add Service
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/80">
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wide px-5 py-3.5">Service</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wide px-5 py-3.5">Duration</th>
                <th className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wide px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-stone-900">{service.name}</td>
                  <td className="px-5 py-3.5 text-stone-500">{formatDuration(service.duration_minutes)}</td>
                  <td className="px-5 py-3.5 font-semibold text-stone-900">{formatPrice(service.price_cents)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`?edit=${service.id}`} className="p-1.5 rounded-lg text-stone-400 hover:text-ember-600 hover:bg-ember-50 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <form action={deleteService}>
                        <input type="hidden" name="id" value={service.id} />
                        <DeleteButton confirm={`Delete "${service.name}"?`} />
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

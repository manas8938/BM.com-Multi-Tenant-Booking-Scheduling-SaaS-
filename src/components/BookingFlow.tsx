'use client'
// Client Component — manages multi-step wizard state with useState, like a controlled form in React you already know
import { useState, useEffect } from 'react'
import { Check, Clock, ChevronLeft, Loader2 } from 'lucide-react'
import { fetchSlots, createBooking, type BookingResult } from '@/app/[businessSlug]/actions'
import type { TimeSlot } from '@/lib/slots'
import { createClient } from '@/lib/supabase/client'

interface Service {
  id: string
  name: string
  duration_minutes: number
  price_cents: number
}

interface Staff {
  id: string
  name: string
}

type Step = 'service' | 'staff' | 'date' | 'slot' | 'details' | 'success'

export function BookingFlow({
  businessId,
  services,
  staff,
}: {
  businessId: string
  services: Service[]
  staff: Staff[]
}) {
  const [step, setStep] = useState<Step>('service')
  const [service, setService] = useState<Service | null>(null)
  const [member, setMember] = useState<Staff | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<TimeSlot | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancelToken, setCancelToken] = useState<string | null>(null)

  useEffect(() => {
    if (!member || !service || !date) return
    setLoadingSlots(true)
    setSlots([])
    fetchSlots(member.id, service.id, date).then((s) => {
      setSlots(s)
      setLoadingSlots(false)
    })
  }, [member, service, date])

  useEffect(() => {
    if (step !== 'slot' || !member || !date) return

    const supabase = createClient()
    // Like a WebSocket room subscription, but Supabase manages the realtime connection (no manual socket.io setup needed).
    const channel = supabase
      .channel(`bookings-${member.id}-${date}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings', filter: `staff_id=eq.${member.id}` },
        (payload) => {
          const startTime = payload.new.start_time as string | undefined
          if (!startTime) return

          const bookingDate = startTime.split('T')[0]
          if (bookingDate !== date) return

          setSlots((prev) => prev.filter((s) => s.start !== startTime))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [step, member, date])

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  function formatPrice(cents: number) {
    return cents > 0 ? `$${(cents / 100).toFixed(2)}` : 'Free'
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  async function handleConfirm() {
    if (!service || !member || !slot) return
    setSubmitting(true)
    setError(null)

    const result: BookingResult = await createBooking({
      businessId,
      staffId: member.id,
      serviceId: service.id,
      startTime: slot.start,
      endTime: slot.end,
      customerName: name,
      customerEmail: email,
    })

    setSubmitting(false)

    if (!result.success) {
      setError(result.error)
      // slot was taken — refresh slot list and send back to slot step
      if (date) {
        setLoadingSlots(true)
        const fresh = await fetchSlots(member.id, service.id, date)
        setSlots(fresh)
        setLoadingSlots(false)
      }
      setSlot(null)
      setStep('slot')
      return
    }

    setCancelToken(result.cancelToken)
    setStep('success')
  }

  // ---- SUCCESS ----
  if (step === 'success') {
    return (
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 text-center animate-fadeInUp">
        <div className="w-14 h-14 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={26} className="text-mint-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-1">Booking confirmed</h2>
        <p className="text-sm text-stone-500 mb-6">
          Save this confirmation for your records.
        </p>
        <div className="bg-stone-50 rounded-lg p-4 text-left text-sm space-y-1.5">
          <p><span className="text-stone-400">Service:</span> <span className="font-medium text-stone-900">{service?.name}</span></p>
          <p><span className="text-stone-400">With:</span> <span className="font-medium text-stone-900">{member?.name}</span></p>
          <p><span className="text-stone-400">When:</span> <span className="font-medium text-stone-900">{slot && new Date(slot.start).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></p>
        </div>
        {cancelToken && (
          <a href={`/cancel/${cancelToken}`} className="inline-block mt-4 text-sm text-stone-400 hover:text-ember-600 underline underline-offset-2 transition-colors">
            Need to cancel? Click here
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 animate-fadeInUp">
      {/* Progress / back */}
      {step !== 'service' && (
        <button
          onClick={() => {
            if (step === 'staff') setStep('service')
            else if (step === 'date') setStep('staff')
            else if (step === 'slot') setStep('date')
            else if (step === 'details') setStep('slot')
          }}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-ember-600 mb-4 transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      )}

      {error && step !== 'slot' && (
        <div className="bg-ember-50 border border-ember-200 text-ember-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {/* STEP: service */}
      {step === 'service' && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-1">Choose a service</h2>
          <p className="text-sm text-stone-500 mb-4">Select what you&apos;d like to book</p>
          <div className="space-y-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => { setService(s); setStep('staff') }}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-ember-300 hover:bg-ember-50/40 transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-stone-900">{s.name}</p>
                  <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                    <Clock size={12} /> {s.duration_minutes} min
                  </p>
                </div>
                <span className="font-semibold text-ember-600">{formatPrice(s.price_cents)}</span>
              </button>
            ))}
            {services.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-8">No services available yet.</p>
            )}
          </div>
        </div>
      )}

      {/* STEP: staff */}
      {step === 'staff' && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-1">Choose staff</h2>
          <p className="text-sm text-stone-500 mb-4">Who would you like to see?</p>
          <div className="space-y-2">
            {staff.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMember(m); setStep('date') }}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-stone-200 hover:border-ember-300 hover:bg-ember-50/40 transition-colors text-left"
              >
                <div className="w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center font-semibold text-ink-900 text-sm">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium text-stone-900">{m.name}</p>
              </button>
            ))}
            {staff.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-8">No staff available yet.</p>
            )}
          </div>
        </div>
      )}

      {/* STEP: date */}
      {step === 'date' && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-1">Choose a date</h2>
          <p className="text-sm text-stone-500 mb-4">Pick a day in the next week</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {next7Days.map((d) => {
              const iso = d.toISOString().split('T')[0]
              return (
                <button
                  key={iso}
                  onClick={() => { setDate(iso); setStep('slot') }}
                  className="flex flex-col items-center p-3 rounded-lg border border-stone-200 hover:border-ember-300 hover:bg-ember-50/40 transition-colors"
                >
                  <span className="text-xs text-stone-400 uppercase">{d.toLocaleDateString([], { weekday: 'short' })}</span>
                  <span className="font-semibold text-stone-900 mt-0.5">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP: slot */}
      {step === 'slot' && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-1">Choose a time</h2>
          <p className="text-sm text-stone-500 mb-4">
            {date && new Date(`${date}T00:00:00`).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          {error && (
            <div className="bg-ember-50 border border-ember-200 text-ember-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {loadingSlots && (
            <div className="flex items-center justify-center py-12 text-stone-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          )}

          {!loadingSlots && slots.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">No available slots on this day. Try another date.</p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => { setSlot(s); setError(null); setStep('details') }}
                  className="p-3 rounded-lg border border-stone-200 hover:border-ember-300 hover:bg-ember-50/40 transition-colors font-medium text-sm text-stone-900"
                >
                  {formatTime(s.start)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP: details */}
      {step === 'details' && (
        <div>
          <h2 className="font-semibold text-stone-900 mb-1">Your details</h2>
          <p className="text-sm text-stone-500 mb-4">
            {service?.name} with {member?.name}
            {slot && ` — ${new Date(slot.start).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 outline-none"
              />
            </div>
            <button
              onClick={handleConfirm}
              disabled={!name || !email || submitting}
              className="w-full bg-ember-600 hover:bg-ember-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Confirm booking
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

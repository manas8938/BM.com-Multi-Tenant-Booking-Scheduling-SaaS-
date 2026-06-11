import { createClient } from '@/lib/supabase/server'

// Plain utility function — like a NestJS service method, but called directly from Server Components/Actions, no DI needed
export interface TimeSlot {
  start: string // ISO datetime
  end: string   // ISO datetime
}

export async function getAvailableSlots(
  staffId: string,
  serviceId: string,
  date: string // 'YYYY-MM-DD'
): Promise<TimeSlot[]> {
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  if (!service) return []
  const duration = service.duration_minutes

  const dayOfWeek = new Date(`${date}T00:00:00`).getDay()

  const { data: availSlots } = await supabase
    .from('availability_slots')
    .select('start_time, end_time')
    .eq('staff_id', staffId)
    .eq('day_of_week', dayOfWeek)

  if (!availSlots || availSlots.length === 0) return []

  const dayStart = `${date}T00:00:00`
  const dayEnd = `${date}T23:59:59`

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('staff_id', staffId)
    .gte('start_time', dayStart)
    .lte('start_time', dayEnd)
    .neq('status', 'cancelled')

  const booked = (bookings ?? []).map((b) => ({
    start: new Date(b.start_time).getTime(),
    end: new Date(b.end_time).getTime(),
  }))

  const now = Date.now()
  const slots: TimeSlot[] = []

  for (const avail of availSlots) {
    const [startH, startM] = avail.start_time.split(':').map(Number)
    const [endH, endM] = avail.end_time.split(':').map(Number)

    const windowStart = new Date(`${date}T00:00:00`)
    windowStart.setHours(startH, startM, 0, 0)

    const windowEnd = new Date(`${date}T00:00:00`)
    windowEnd.setHours(endH, endM, 0, 0)

    let cursor = windowStart.getTime()
    const stepMs = duration * 60000

    while (cursor + stepMs <= windowEnd.getTime()) {
      const slotEnd = cursor + stepMs

      if (cursor >= now) {
        const overlaps = booked.some((b) => cursor < b.end && slotEnd > b.start)
        if (!overlaps) {
          slots.push({
            start: new Date(cursor).toISOString(),
            end: new Date(slotEnd).toISOString(),
          })
        }
      }

      cursor = slotEnd
    }
  }

  return slots
}

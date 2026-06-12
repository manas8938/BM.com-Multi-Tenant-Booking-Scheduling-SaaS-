'use server'
// Server Actions callable from a Client Component — like calling a service method directly, no REST endpoint needed
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots, type TimeSlot } from '@/lib/slots'

export async function fetchSlots(
  staffId: string,
  serviceId: string,
  date: string
): Promise<TimeSlot[]> {
  return getAvailableSlots(staffId, serviceId, date)
}

export type BookingResult =
  | { success: true; bookingId: string; cancelToken: string }
  | { success: false; error: string }

export async function createBooking(input: {
  businessId: string
  staffId: string
  serviceId: string
  startTime: string
  endTime: string
  customerName: string
  customerEmail: string
}): Promise<BookingResult> {
  const supabase = await createClient()

  // Re-check slot is still free right before insert — minimizes race window
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('staff_id', input.staffId)
    .eq('start_time', input.startTime)
    .neq('status', 'cancelled')
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'This slot was just booked by someone else. Please pick another time.' }
  }

  // unique index on (staff_id, start_time) is the real guard — same concept as MIKNAZ voucher-claim locking,
  // but enforced by Postgres instead of Redis
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      business_id: input.businessId,
      staff_id: input.staffId,
      service_id: input.serviceId,
      start_time: input.startTime,
      end_time: input.endTime,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      status: 'confirmed',
    })
    .select('id, cancel_token')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This slot was just booked by someone else. Please pick another time.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true, bookingId: data.id, cancelToken: data.cancel_token }
}

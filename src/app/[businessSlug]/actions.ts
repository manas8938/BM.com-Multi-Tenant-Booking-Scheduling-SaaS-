'use server'
// Server Actions callable from a Client Component — like calling a service method directly, no REST endpoint needed
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots, type TimeSlot } from '@/lib/slots'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { resend, EMAIL_FROM, bookingConfirmationEmail } from '@/lib/resend'

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

async function checkSlotTaken(staffId: string, startTime: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('staff_id', staffId)
    .eq('start_time', startTime)
    .neq('status', 'cancelled')
    .maybeSingle()
  return !!existing
}


// Fires off a booking confirmation email — best-effort, never blocks the booking flow on failure
async function sendBookingEmail(bookingId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('bookings')
      .select(`
        start_time,
        customer_email,
        customer_name,
        cancel_token,
        deposit_paid,
        deposit_cents,
        businesses ( name, slug ),
        services ( name ),
        staff ( name )
      `)
      .eq('id', bookingId)
      .single()

    if (!data) return

    const business = Array.isArray(data.businesses) ? data.businesses[0] : data.businesses
    const service = Array.isArray(data.services) ? data.services[0] : data.services
    const staff = Array.isArray(data.staff) ? data.staff[0] : data.staff
    if (!business || !service || !staff) return

    await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customer_email,
      subject: `Booking confirmed — ${business.name}`,
      html: bookingConfirmationEmail({
        businessName: business.name,
        serviceName: service.name,
        staffName: staff.name,
        startTime: data.start_time,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel/${data.cancel_token}`,
        depositPaid: data.deposit_paid,
        depositCents: data.deposit_cents,
      }),
    })
  } catch (err) {
    console.error('sendBookingEmail error:', err)
  }
}

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
  if (await checkSlotTaken(input.staffId, input.startTime)) {
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

  await sendBookingEmail(data.id)

  return { success: true, bookingId: data.id, cancelToken: data.cancel_token }
}

// Used when a service requires a deposit — creates a one-time Stripe Checkout session
// carrying all booking details in metadata, then redirects to Stripe.
export async function createDepositCheckout(input: {
  businessId: string
  businessSlug: string
  staffId: string
  serviceId: string
  serviceName: string
  startTime: string
  endTime: string
  customerName: string
  customerEmail: string
  depositCents: number
}) {
  if (await checkSlotTaken(input.staffId, input.startTime)) {
    return { success: false as const, error: 'This slot was just booked by someone else. Please pick another time.' }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: input.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Deposit — ${input.serviceName}` },
          unit_amount: input.depositCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      businessId: input.businessId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime: input.endTime,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      depositCents: String(input.depositCents),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${input.businessSlug}/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${input.businessSlug}?canceled=true`,
  })

  redirect(session.url!)
}

// Called from the /confirm page after returning from Stripe — idempotent via unique stripe_session_id.
export async function confirmDepositBooking(sessionId: string): Promise<BookingResult & { alreadyExists?: boolean }> {
  const supabase = await createClient()

  // Idempotency: if a booking already references this session, return it instead of inserting again
  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id, cancel_token')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()

  if (existingBooking) {
    return { success: true, bookingId: existingBooking.id, cancelToken: existingBooking.cancel_token, alreadyExists: true }
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    return { success: false, error: 'Payment was not completed.' }
  }

  const m = session.metadata!
  const depositCents = parseInt(m.depositCents)

  if (await checkSlotTaken(m.staffId, m.startTime)) {
    return { success: false, error: 'This slot was booked by someone else while you were paying. Please contact the business for a refund.' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      business_id: m.businessId,
      staff_id: m.staffId,
      service_id: m.serviceId,
      start_time: m.startTime,
      end_time: m.endTime,
      customer_name: m.customerName,
      customer_email: m.customerEmail,
      status: 'confirmed',
      deposit_paid: true,
      deposit_cents: depositCents,
      stripe_session_id: sessionId,
    })
    .select('id, cancel_token')
    .single()

  if (error) {
    return { success: false, error: 'Payment succeeded but booking could not be created. Please contact the business.' }
  }

  await sendBookingEmail(data.id)

  return { success: true, bookingId: data.id, cancelToken: data.cancel_token }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Public action — identified only by cancel_token, no auth required (intentional, like a magic-link unsubscribe)
export async function cancelBooking(formData: FormData) {
  const token = formData.get('token') as string
  const supabase = await createClient()

  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('cancel_token', token)

  redirect(`/cancel/${token}?done=true`)
}

'use server'

import { stripe } from '@/lib/stripe'
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'

// like NestJS: controller method that creates a payment session and redirects
export async function createCheckoutSession() {
  const { business } = await requireBusiness()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    client_reference_id: business.id, // tag session with our business id
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?canceled=true`,
  })

  redirect(session.url!)
}

'use server'
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const PATH = '/dashboard/services'

export async function createService(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  // Price input is in dollars (e.g. "25.00") — store as cents to avoid float precision issues
  const priceCents = Math.round(parseFloat(formData.get('price') as string || '0') * 100)

  const { error } = await supabase.from('services').insert({
    business_id: business.id,
    name: (formData.get('name') as string).trim(),
    duration_minutes: parseInt(formData.get('duration_minutes') as string),
    price_cents: priceCents,
  })

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function updateService(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const priceCents = Math.round(parseFloat(formData.get('price') as string || '0') * 100)

  const { error } = await supabase
    .from('services')
    .update({
      name: (formData.get('name') as string).trim(),
      duration_minutes: parseInt(formData.get('duration_minutes') as string),
      price_cents: priceCents,
    })
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function deleteService(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  await supabase
    .from('services')
    .delete()
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  revalidatePath(PATH)
}

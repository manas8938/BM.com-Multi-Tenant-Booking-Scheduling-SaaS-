'use server'
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const PATH = '/dashboard/staff'

export async function createStaff(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const { error } = await supabase.from('staff').insert({
    business_id: business.id,
    branch_id: formData.get('branch_id') as string || null,
    name: (formData.get('name') as string).trim(),
    email: (formData.get('email') as string).trim().toLowerCase(),
  })

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function updateStaff(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const { error } = await supabase
    .from('staff')
    .update({
      branch_id: formData.get('branch_id') as string || null,
      name: (formData.get('name') as string).trim(),
      email: (formData.get('email') as string).trim().toLowerCase(),
    })
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function deleteStaff(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  await supabase
    .from('staff')
    .delete()
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  revalidatePath(PATH)
}

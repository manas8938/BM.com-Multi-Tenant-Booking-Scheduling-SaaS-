'use server'
// Server Actions — like NestJS controller methods; called directly from forms, no API route needed
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const PATH = '/dashboard/branches'

export async function createBranch(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const { error } = await supabase.from('branches').insert({
    business_id: business.id,
    name: (formData.get('name') as string).trim(),
    address: (formData.get('address') as string).trim(),
  })

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function updateBranch(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const { error } = await supabase
    .from('branches')
    .update({
      name: (formData.get('name') as string).trim(),
      address: (formData.get('address') as string).trim(),
    })
    // RLS enforces tenant isolation; .eq('business_id') is belt-and-suspenders
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(PATH)
}

export async function deleteBranch(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  await supabase
    .from('branches')
    .delete()
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  revalidatePath(PATH)
}

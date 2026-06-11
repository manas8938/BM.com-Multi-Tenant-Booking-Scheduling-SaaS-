'use server'
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const PATH = '/dashboard/availability'

export async function createSlot(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const staffId = formData.get('staff_id') as string

  const { error } = await supabase.from('availability_slots').insert({
    business_id: business.id,
    staff_id: staffId,
    day_of_week: parseInt(formData.get('day_of_week') as string),
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
  })

  if (error) redirect(`${PATH}?staff=${staffId}&error=` + encodeURIComponent(error.message))
  revalidatePath(PATH)
  redirect(`${PATH}?staff=${staffId}`)
}

export async function deleteSlot(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  await supabase
    .from('availability_slots')
    .delete()
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  revalidatePath(PATH)
}

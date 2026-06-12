'use server'
import { requireBusiness } from '@/lib/supabase/server-utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { resend, EMAIL_FROM, staffWelcomeEmail } from '@/lib/resend'

const PATH = '/dashboard/staff'

export async function createStaff(formData: FormData) {
  const { supabase, business } = await requireBusiness()

  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).trim().toLowerCase()

  const { error } = await supabase.from('staff').insert({
    business_id: business.id,
    branch_id: formData.get('branch_id') as string || null,
    name,
    email,
  })

  if (error) redirect(PATH + '?error=' + encodeURIComponent(error.message))

  // Best-effort welcome email — never blocks staff creation on failure
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `You've been added to ${business.name} on BM.com`,
      html: staffWelcomeEmail({
        staffName: name,
        businessName: business.name,
        bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/${business.slug}`,
      }),
    })
  } catch (err) {
    console.error('staffWelcomeEmail error:', err)
  }

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

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', formData.get('id') as string)
    .eq('business_id', business.id)

  if (error) {
    console.error('deleteStaff error:', error)
    const message = error.code === '23503'
      ? 'This staff member has existing bookings and cannot be removed. Cancel or reassign their bookings first.'
      : error.message
    redirect(PATH + '?error=' + encodeURIComponent(message))
  }

  revalidatePath(PATH)
}

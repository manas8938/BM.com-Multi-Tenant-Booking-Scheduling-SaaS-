'use server'
// Server Action — like a NestJS controller POST handler, but called directly from a form, no API route
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBusiness(formData: FormData) {
  const supabase = await createClient()

  // getUser() validates JWT with Supabase server — never use getSession() for auth checks (trusts client-provided token)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const name = (formData.get('name') as string).trim()
  const slug = (formData.get('slug') as string).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

  if (!name || !slug) {
    redirect('/onboarding?error=' + encodeURIComponent('Name and slug are required'))
  }

  const { error } = await supabase.from('businesses').insert({
    name,
    slug,
    owner_id: user.id,
    subscription_tier: 'free',
  })

  if (error) {
    const msg = error.code === '23505'
      ? 'That slug is already taken — try another'
      : error.message
    redirect('/onboarding?error=' + encodeURIComponent(msg))
  }

  // revalidatePath — like clearing an NestJS cache; tells Next.js to re-fetch dashboard data
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

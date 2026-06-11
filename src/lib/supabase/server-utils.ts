// Shared auth+business guard — like a NestJS Guard + entity injector combined
import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function requireBusiness() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug, subscription_tier')
    .eq('owner_id', user.id)
    .single()

  if (!business) redirect('/onboarding')
  return { supabase, user, business }
}

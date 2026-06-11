'use server'
// Server Action — like a NestJS controller method, but called directly from a form, no API route needed
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/signup?error=' + encodeURIComponent('Passwords do not match'))
  }

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password,
  })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  redirect('/onboarding')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // resetPasswordForEmail — sends magic link; redirectTo routes through /auth/callback for PKCE code exchange
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  })

  // Don't reveal whether email exists — always show success to prevent user enumeration
  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/forgot-password?sent=1')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  // updateUser — updates the authenticated user's password; session must exist (set by /auth/callback)
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/login?message=' + encodeURIComponent('Password updated — please sign in'))
}

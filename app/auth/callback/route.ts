// app/auth/callback/route.ts
// This handles the redirect after Google OAuth.
// It saves the user's profile (including role) to the public.profiles table
// then redirects to the correct dashboard.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const role = requestUrl.searchParams.get('role') || 'patient'
  const next = requestUrl.searchParams.get('next') || (role === 'doctor' ? '/doctor' : '/dashboard')

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error && data.user) {
    // Upsert the profile so the user exists in the public schema
    await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        full_name:
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split('@')[0] ||
          'User',
        email: data.user.email,
        // If the user already has a role in metadata, keep it; otherwise use the one from the URL
        role: data.user.user_metadata?.role || role,
      },
      { onConflict: 'id' }
    )
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

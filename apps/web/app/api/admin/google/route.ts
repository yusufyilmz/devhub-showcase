import { createServerClient } from '@shared/lib/supabase'
import { NextResponse } from 'next/server'
import { sameOrigin } from '../../../../lib/admin-auth'

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: 'Invalid request origin.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    )
  const origin = new URL(request.url).origin
  try {
    const client = await createServerClient()
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' }
      }
    })
    if (error || !data.url) throw new Error('Could not start Google sign in')
    const response = NextResponse.redirect(data.url, 303)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    const response = NextResponse.redirect(
      new URL('/admin/login?error=google_failed', origin),
      303
    )
    response.headers.set('Cache-Control', 'no-store')
    return response
  }
}

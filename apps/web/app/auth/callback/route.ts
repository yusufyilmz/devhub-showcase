import { ProfileAccessError } from '@shared/lib/profile-errors'
import { createServerClient } from '@shared/lib/supabase'
import { NextResponse } from 'next/server'
import { requireWorkspace } from '../../../lib/admin-auth'

const redirect = (origin: string, path: string) => {
  const response = NextResponse.redirect(new URL(path, origin), 303)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  if (!code || url.searchParams.has('error'))
    return redirect(url.origin, '/admin/login?error=google_failed')
  try {
    const client = await createServerClient()
    const { error } = await client.auth.exchangeCodeForSession(code)
    if (error) return redirect(url.origin, '/admin/login?error=google_failed')
    try {
      await requireWorkspace(client)
    } catch (reason) {
      // Provision only the verified user's workspace; site moderation stays separate.
      await client.auth.signOut({ scope: 'local' })
      return redirect(
        url.origin,
        reason instanceof ProfileAccessError
          ? '/admin/login?error=not_owner'
          : '/admin/login?error=setup'
      )
    }
    // Never accept an arbitrary return URL or trust forwarded host headers.
    return redirect(url.origin, '/admin')
  } catch {
    return redirect(url.origin, '/admin/login?error=google_failed')
  }
}

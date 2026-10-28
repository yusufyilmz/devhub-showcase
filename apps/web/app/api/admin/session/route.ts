import { ProfileAccessError } from '@shared/lib/profile-errors'
import { createServerClient } from '@shared/lib/supabase'
import { z } from 'zod'
import { requireAdmin, sameOrigin } from '../../../../lib/admin-auth'

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 })
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(300) })
    .safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return Response.json(
      { error: 'Enter your email and password.' },
      { status: 400 }
    )
  try {
    const client = await createServerClient()
    const { error } = await client.auth.signInWithPassword(parsed.data)
    if (error)
      return Response.json(
        {
          error: 'Could not sign in. Check your credentials or try again later.'
        },
        { status: 401 }
      )
    try {
      await requireAdmin()
    } catch (error) {
      await client.auth.signOut({ scope: 'local' })
      throw error
    }
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof ProfileAccessError
            ? 'This account cannot edit the portfolio.'
            : 'Admin storage is not ready. Check the Supabase setup.'
      },
      { status: error instanceof ProfileAccessError ? 403 : 503 }
    )
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 })
  try {
    const client = await createServerClient()
    const { error } = await client.auth.signOut({ scope: 'local' })
    if (error) throw error
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return Response.json(
      { error: 'Could not sign out. Try again.' },
      { status: 503 }
    )
  }
}

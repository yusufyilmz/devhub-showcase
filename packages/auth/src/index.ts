import type { SupabaseClient } from '@supabase/supabase-js'
export type AuthClient = Pick<SupabaseClient, 'auth'>
export class AuthAccessError extends Error {
  constructor() {
    super('Sign in with a confirmed account to continue.')
  }
}
export async function requireConfirmedUser(
  client: AuthClient,
  accessError: () => Error = () => new AuthAccessError()
) {
  const { data, error } = await client.auth.getUser()
  if (error || !data.user?.email_confirmed_at) throw accessError()
  return data.user
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin
}

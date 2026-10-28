import { ProfileAccessError } from '@shared/lib/profile-errors'
import { SupabaseProfileRepository } from '@shared/lib/profile-repository'
import { ProfileService } from '@shared/lib/profile-service'
import { createServerClient } from '@shared/lib/supabase'
import type { SupabaseDbClient } from '@shared/lib/types'
import { ensureUserProfile } from '@shared/lib/user-profile'

export async function requireAdmin(providedClient?: SupabaseDbClient) {
  const client = providedClient ?? (await createServerClient())
  const { data, error } = await client.auth.getUser()
  if (error || !data.user || !data.user.email_confirmed_at)
    throw new ProfileAccessError()
  const repository = new SupabaseProfileRepository(client)
  const service = new ProfileService(repository)
  await service.requireOwner(data.user.id)
  return { client, user: data.user, repository, service }
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin
}

/** Every confirmed user gets a separate CV workspace. Site moderation still uses requireAdmin. */
export async function requireWorkspace(providedClient?: SupabaseDbClient) {
  const client = providedClient ?? (await createServerClient())
  const { data, error } = await client.auth.getUser()
  if (error || !data.user || !data.user.email_confirmed_at)
    throw new ProfileAccessError()
  const repository = await ensureUserProfile(client, data.user)
  const service = new ProfileService(repository)
  await service.requireOwner(data.user.id)
  return { client, user: data.user, repository, service }
}

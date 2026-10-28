import { requireConfirmedUser } from '@shared/auth'
import { ProfileAccessError } from '@shared/lib/profile-errors'
import { SupabaseProfileRepository } from '@shared/lib/profile-repository'
import { ProfileService } from '@shared/lib/profile-service'
import { createServerClient } from '@shared/lib/supabase'
import type { SupabaseDbClient } from '@shared/lib/types'
import { ensureUserProfile } from '@shared/lib/user-profile'

export async function requireAdmin(providedClient?: SupabaseDbClient) {
  const client = providedClient ?? (await createServerClient())
  const user = await requireConfirmedUser(
    client,
    () => new ProfileAccessError()
  )
  const repository = new SupabaseProfileRepository(client)
  const service = new ProfileService(repository)
  await service.requireOwner(user.id)
  return { client, user, repository, service }
}
export { sameOrigin } from '@shared/auth'

/** Every confirmed user gets a separate CV workspace. Site moderation still uses requireAdmin. */
export async function requireWorkspace(providedClient?: SupabaseDbClient) {
  const client = providedClient ?? (await createServerClient())
  const user = await requireConfirmedUser(
    client,
    () => new ProfileAccessError()
  )
  const repository = await ensureUserProfile(client, user)
  const service = new ProfileService(repository)
  await service.requireOwner(user.id)
  return { client, user, repository, service }
}

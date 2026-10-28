import type { PortfolioProfile } from '@shared/content'
import { validateProfile } from '../domain/profile'
import { ProfileSetupError } from '../repositories/profile-repository'
import { SupabaseProfileRepository } from '../repositories/supabase-profile-repository'
import type { SupabaseDbClient } from '../types'
import type { Json } from '../types/supabase/database.types'

export function createEmptyProfile(user: {
  email?: string
  user_metadata?: Record<string, unknown>
}): PortfolioProfile {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name
  return validateProfile({
    name:
      typeof name === 'string' && name.trim()
        ? name.trim().slice(0, 200)
        : 'Your name',
    title: 'Add your professional title',
    location: 'Add your location',
    email: user.email,
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    summary: 'Add a short professional summary.',
    about: [],
    experiences: [],
    projects: [],
    education: [],
    skills: {},
    languages: [],
    cvUrl: '/cv.pdf',
    appearance: { accent: 'cyan', defaultTheme: 'system' }
  })
}
/** Resolve identity from the verified session, never from a request body or email. */
export async function ensureUserProfile(
  client: SupabaseDbClient,
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> }
) {
  const find = () =>
    client
      .from('portfolio_profiles')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle()
  const existing = await find()
  if (existing.error) throw new ProfileSetupError()
  if (existing.data)
    return new SupabaseProfileRepository(client, existing.data.id)
  const id = crypto.randomUUID()
  const { error } = await client.from('portfolio_profiles').insert({
    id,
    owner_id: user.id,
    document: createEmptyProfile(user) as unknown as Json
  })
  if (error) {
    // A parallel callback/tab may have created this user's unique profile first.
    if (error.code !== '23505') throw new ProfileSetupError()
    const winner = await find()
    if (winner.error || !winner.data) throw new ProfileSetupError()
    return new SupabaseProfileRepository(client, winner.data.id)
  }
  return new SupabaseProfileRepository(client, id)
}

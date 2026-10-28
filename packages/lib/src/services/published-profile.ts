import { profile } from '@shared/content'
import { createClient } from '@supabase/supabase-js'
import { validateProfile } from '../domain/profile'
import {
  ProfileNotFoundError,
  ProfileSetupError,
  type ProfileSnapshot
} from '../repositories/profile-repository'
import { SupabaseProfileRepository } from '../repositories/supabase-profile-repository'
import type { Database } from '../types'

/** Public read only: the same source is used by the website, PDF and Plop. */
export async function readPublishedProfile(): Promise<ProfileSnapshot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url && !key)
    return { profile: validateProfile(profile), revision: 0, updatedAt: '' }
  if (!url || !key) throw new ProfileSetupError()
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' })
    }
  })
  const published = await new SupabaseProfileRepository(client).read()
  if (!published) throw new ProfileNotFoundError()
  return published
}

/** Named public profiles never fall back to somebody else's data. */
export async function readPublicProfile(
  id: string
): Promise<ProfileSnapshot | null> {
  if (
    id !== 'main' &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' })
    }
  })
  const snapshot = await new SupabaseProfileRepository(client, id).read()
  return snapshot?.isPublic ? snapshot : null
}

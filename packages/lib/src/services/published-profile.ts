import { profile } from '@shared/content'
import { createClient } from '@supabase/supabase-js'
import { validateProfile } from '../domain/profile'
import {
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
  if (!published) throw new ProfileSetupError()
  return published
}

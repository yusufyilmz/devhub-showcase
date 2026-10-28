import { profile } from '@shared/content'
import { validateProfile } from '@shared/lib/profile'
import type { ProfileSnapshot } from '@shared/lib/profile-errors'
import { SupabaseProfileRepository } from '@shared/lib/profile-repository'
import type { Database } from '@shared/lib/types'
import { createClient } from '@supabase/supabase-js'
import { connection } from 'next/server'
import { cache } from 'react'

export const getPublishedProfile = cache(async (): Promise<ProfileSnapshot> => {
  const fallback = {
    profile: validateProfile(profile),
    revision: 0,
    updatedAt: ''
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return fallback
  await connection()
  try {
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' })
      }
    })
    return (await new SupabaseProfileRepository(client).read()) ?? fallback
  } catch {
    console.warn(
      'Published portfolio storage is unavailable; using the bundled profile.'
    )
    return fallback
  }
})

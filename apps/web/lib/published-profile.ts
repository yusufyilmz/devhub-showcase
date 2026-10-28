import { profile } from '@shared/content'
import { validateProfile } from '@shared/lib/profile'
import type { ProfileSnapshot } from '@shared/lib/profile-errors'
import { readPublishedProfile } from '@shared/lib/published-profile'
import { connection } from 'next/server'
import { cache } from 'react'

export const getPublishedProfile = cache(async (): Promise<ProfileSnapshot> => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) await connection()
  try {
    return await readPublishedProfile()
  } catch {
    console.warn(
      'Published portfolio storage is unavailable; using the bundled profile.'
    )
    return { profile: validateProfile(profile), revision: 0, updatedAt: '' }
  }
})

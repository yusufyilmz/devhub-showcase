import { profile } from '@shared/content'
import { validateProfile } from '@shared/lib/profile'
import {
  ProfileNotFoundError,
  type ProfileSnapshot
} from '@shared/lib/profile-errors'
import { readPublishedProfile } from '@shared/lib/published-profile'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'

export const getPublishedProfile = cache(async (): Promise<ProfileSnapshot> => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) await connection()
  try {
    return await readPublishedProfile()
  } catch (error) {
    if (error instanceof ProfileNotFoundError) notFound()
    console.warn(
      'Published portfolio storage is unavailable; using the bundled profile.'
    )
    return { profile: validateProfile(profile), revision: 0, updatedAt: '' }
  }
})

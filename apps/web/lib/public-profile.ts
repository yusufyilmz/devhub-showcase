import {
  readPublicProfile,
  readPublicProfileByUsername
} from '@shared/lib/published-profile'
import { notFound } from 'next/navigation'
import { cache } from 'react'
export const getPublicProfile = cache(async (id: string) => {
  const snapshot = await readPublicProfile(id)
  if (!snapshot) notFound()
  return snapshot
})

export const getUsernameProfile = cache(async (username: string) => {
  const snapshot = await readPublicProfileByUsername(username)
  if (!snapshot) notFound()
  return snapshot
})

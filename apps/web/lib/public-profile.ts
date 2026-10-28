import { readPublicProfile } from '@shared/lib/published-profile'
import { notFound } from 'next/navigation'
import { cache } from 'react'
export const getPublicProfile = cache(async (id: string) => {
  const snapshot = await readPublicProfile(id)
  if (!snapshot) notFound()
  return snapshot
})

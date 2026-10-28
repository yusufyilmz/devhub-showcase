import { headers } from 'next/headers'
import { cache } from 'react'
import { requireWorkspace } from './admin-auth'
import { getPublicProfile } from './public-profile'
import { getPublishedProfile } from './published-profile'
export const getActiveProfile = cache(async () => {
  const path = (await headers()).get('x-profile-path') ?? '/'
  const match = path.match(/^\/p\/([^/]+)(?:\/|$)/)
  if (match?.[1]) return getPublicProfile(match[1])
  if (path === '/admin') {
    try {
      const { repository } = await requireWorkspace()
      const snapshot = await repository.read()
      if (snapshot) return snapshot
    } catch {
      /* The editor page handles authentication/setup failures. */
    }
  }
  return getPublishedProfile()
})

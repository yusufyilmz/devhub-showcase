import { describe, expect, it, vi } from 'vitest'
import {
  createEmptyProfile,
  ensureUserProfile
} from '../packages/lib/src/services/user-profile'
import type { SupabaseDbClient } from '../packages/lib/src/types'

describe('personal workspace', () => {
  it('starts with the signed in identity and no facts copied from the site owner', () => {
    const profile = createEmptyProfile({
      email: 'alice@example.com',
      user_metadata: { full_name: 'Alice' }
    })
    expect(profile.name).toBe('Alice')
    expect(profile.email).toBe('alice@example.com')
    expect(profile.experiences).toEqual([])
    expect(profile.projects).toEqual([])
    expect(profile.skills).toEqual({})
    expect(JSON.stringify(profile)).not.toContain('Yusuf')
    expect(profile.website).toBe('')
    expect(profile.templateChosen).toBe(false)
  })
  it('resolves an existing profile using the authenticated UUID', async () => {
    const eq = vi.fn().mockReturnValue({
      maybeSingle: async () => ({
        data: { id: 'alice-profile' },
        error: null
      })
    })
    const client = {
      from: () => ({ select: () => ({ eq }) })
    } as unknown as SupabaseDbClient
    const repo = await ensureUserProfile(client, {
      id: 'alice',
      email: 'alice@example.com'
    })
    expect(eq).toHaveBeenCalledWith('owner_id', 'alice')
    expect(repo.id).toBe('alice-profile')
  })
  it('inserts only a private profile owned by that identity', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null })
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) })
        }),
        insert
      })
    } as unknown as SupabaseDbClient
    await ensureUserProfile(client, { id: 'alice', email: 'alice@example.com' })
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        owner_id: 'alice',
        document: expect.objectContaining({ name: 'Your name' })
      })
    )
    expect(insert.mock.calls[0]?.[0].is_public).toBeUndefined()
    expect(insert.mock.calls[0]?.[0].id).not.toBe('main')
  })
})

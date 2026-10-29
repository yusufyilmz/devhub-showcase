import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
  publicProfile: vi.fn()
}))
vi.mock('@shared/lib/supabase', () => ({
  createServerClient: async () => ({
    auth: { getUser: mocks.getUser },
    from: mocks.from
  })
}))
vi.mock('@shared/lib/published-profile', () => ({
  readPublicProfile: mocks.publicProfile
}))

import { getHomeAction, getHomeExample } from '../apps/web/lib/home-links'

beforeEach(() => {
  vi.resetAllMocks()
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
  mocks.from.mockReturnValue({ select: mocks.select })
  mocks.select.mockReturnValue({ eq: mocks.eq })
  mocks.eq.mockReturnValue({ maybeSingle: mocks.maybeSingle })
  mocks.maybeSingle.mockResolvedValue({
    data: { username: 'alice' },
    error: null
  })
})
it('offers sign in to a visitor without looking up or creating a portfolio', async () => {
  expect(await getHomeAction()).toEqual({
    href: '/admin/login',
    label: 'Create your portfolio',
    signedIn: false
  })
  expect(mocks.from).not.toHaveBeenCalled()
})
it('uses only the verified UUID to find the current account editor', async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: 'alice-id', email_confirmed_at: 'today' } },
    error: null
  })
  expect((await getHomeAction()).href).toBe('/alice/edit')
  expect(mocks.select).toHaveBeenCalledWith('username')
  expect(mocks.eq).toHaveBeenCalledWith('owner_id', 'alice-id')
})
it('does not use an unconfirmed session or an errored identity', async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: 'alice', email_confirmed_at: null } },
    error: null
  })
  expect((await getHomeAction()).signedIn).toBe(false)
  mocks.getUser.mockResolvedValue({
    data: { user: { id: 'alice', email_confirmed_at: 'today' } },
    error: new Error('invalid token')
  })
  expect((await getHomeAction()).signedIn).toBe(false)
  expect(mocks.from).not.toHaveBeenCalled()
})
it('uses the studio entry for an existing session without a workspace and handles setup outages', async () => {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: 'alice-id', email_confirmed_at: 'today' } },
    error: null
  })
  mocks.maybeSingle.mockResolvedValue({ data: null, error: null })
  expect((await getHomeAction()).href).toBe('/admin')
  mocks.getUser.mockRejectedValue(new Error('unavailable'))
  expect((await getHomeAction()).href).toBe('/admin/login')
})
it('offers an example only when the main portfolio is public and uses its current username', async () => {
  mocks.publicProfile.mockResolvedValue({ username: 'renamed-owner' })
  expect(await getHomeExample()).toBe('/renamed-owner')
  mocks.publicProfile.mockResolvedValue(null)
  expect(await getHomeExample()).toBeNull()
  mocks.publicProfile.mockRejectedValue(new Error('private or unavailable'))
  expect(await getHomeExample()).toBeNull()
})

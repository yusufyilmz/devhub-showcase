import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileAccessError } from '../packages/lib/src/repositories/profile-repository'

const mocks = vi.hoisted(() => ({
  oauth: vi.fn(),
  exchange: vi.fn(),
  signOut: vi.fn(),
  owner: vi.fn()
}))
const client = {
  auth: {
    signInWithOAuth: mocks.oauth,
    exchangeCodeForSession: mocks.exchange,
    signOut: mocks.signOut
  }
}
vi.mock('@shared/lib/supabase', () => ({
  createServerClient: async () => client
}))
vi.mock('../apps/web/lib/admin-auth', async (original) => ({
  ...(await original<typeof import('../apps/web/lib/admin-auth')>()),
  requireAdmin: mocks.owner
}))

import { POST } from '../apps/web/app/api/admin/google/route'
import { GET } from '../apps/web/app/auth/callback/route'

beforeEach(() => {
  vi.resetAllMocks()
  mocks.oauth.mockResolvedValue({
    data: {
      url: 'https://example.supabase.co/auth/v1/authorize?provider=google'
    },
    error: null
  })
  mocks.exchange.mockResolvedValue({ error: null })
  mocks.owner.mockResolvedValue({})
  mocks.signOut.mockResolvedValue({ error: null })
})
const origin = 'https://yusufdevhub.vercel.app'
describe('Google sign in', () => {
  it('starts PKCE at a fixed callback and redirects to the provider', async () => {
    const response = await POST(
      new Request(`${origin}/api/admin/google?next=https://evil.example`, {
        method: 'POST',
        headers: { origin }
      })
    )
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toContain(
      'https://example.supabase.co/auth/v1/authorize'
    )
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(mocks.oauth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' }
      }
    })
  })
  it.each(['https://evil.example', 'null', ''])(
    'rejects an untrusted origin: %s',
    async (requestOrigin) => {
      expect(
        (
          await POST(
            new Request(`${origin}/api/admin/google`, {
              method: 'POST',
              headers: { origin: requestOrigin }
            })
          )
        ).status
      ).toBe(403)
      expect(mocks.oauth).not.toHaveBeenCalled()
    }
  )
  it('handles provider setup errors without exposing details', async () => {
    mocks.oauth.mockRejectedValue(new Error('internal configuration'))
    const response = await POST(
      new Request(`${origin}/api/admin/google`, {
        method: 'POST',
        headers: { origin }
      })
    )
    expect(response.headers.get('location')).toBe(
      `${origin}/admin/login?error=google_failed`
    )
  })
})
describe('Google callback', () => {
  it('exchanges the code, checks ownership, and ignores arbitrary redirect targets', async () => {
    const response = await GET(
      new Request(
        `${origin}/auth/callback?code=valid-code&next=//evil.example`,
        { headers: { 'x-forwarded-host': 'evil.example' } }
      )
    )
    expect(mocks.exchange).toHaveBeenCalledWith('valid-code')
    expect(mocks.owner).toHaveBeenCalledWith(client)
    expect(response.headers.get('location')).toBe(`${origin}/admin`)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('referrer-policy')).toBe('no-referrer')
  })
  it.each(['?error=access_denied', '', '?code=bad&error=access_denied'])(
    'handles cancelled or missing authorization: %s',
    async (query) => {
      const response = await GET(new Request(`${origin}/auth/callback${query}`))
      expect(response.headers.get('location')).toBe(
        `${origin}/admin/login?error=google_failed`
      )
      expect(mocks.exchange).not.toHaveBeenCalled()
    }
  )
  it('rejects a failed PKCE exchange before ownership checks', async () => {
    mocks.exchange.mockResolvedValue({ error: new Error('bad verifier') })
    expect(
      (
        await GET(new Request(`${origin}/auth/callback?code=invalid`))
      ).headers.get('location')
    ).toContain('error=google_failed')
    expect(mocks.owner).not.toHaveBeenCalled()
  })
  it('clears the local session for an authenticated nonowner', async () => {
    mocks.owner.mockRejectedValue(new ProfileAccessError())
    expect(
      (
        await GET(new Request(`${origin}/auth/callback?code=valid`))
      ).headers.get('location')
    ).toBe(`${origin}/admin/login?error=not_owner`)
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
  })
  it('clears the session when ownership storage is unavailable', async () => {
    mocks.owner.mockRejectedValue(new Error('missing table'))
    expect(
      (
        await GET(new Request(`${origin}/auth/callback?code=valid`))
      ).headers.get('location')
    ).toBe(`${origin}/admin/login?error=setup`)
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
  })
})

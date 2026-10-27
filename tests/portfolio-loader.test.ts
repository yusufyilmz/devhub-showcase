import { afterEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  referrals: vi.fn(),
  projects: vi.fn(),
  client: vi.fn(),
  warn: vi.fn()
}))
vi.mock('@shared/lib/services', () => ({
  ReferralService: class {
    getAll = mocks.referrals
  },
  ProjectService: class {
    getAll = mocks.projects
  }
}))
vi.mock('@shared/lib/supabase', () => ({ createServerClient: mocks.client }))
vi.mock('@shared/lib/logger', () => ({ logger: { warn: mocks.warn } }))

import { loadPageResources } from '../apps/web/lib/portfolio-resources'

afterEach(() => {
  vi.resetAllMocks()
  vi.unstubAllEnvs()
})
it('serves current CV content without requiring external services', async () => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
  expect((await loadPageResources()).experiences[0]?.company.name).toBe(
    'dLocal'
  )
  expect(mocks.client).not.toHaveBeenCalled()
})
it('preserves public database projects, excludes private projects and prefers the versioned profile', async () => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'publishable')
  mocks.client.mockResolvedValue({})
  mocks.referrals.mockResolvedValue([])
  mocks.projects.mockResolvedValue([
    { id: 'historical-tool', title: 'Historical public tool', public: true },
    { id: 'private', title: 'Private project', public: false },
    { id: 'stale-fitness', title: 'Yusuf Fitness OS', public: true }
  ])
  const result = await loadPageResources()
  expect(result.projects.map((item) => item.id)).toEqual([
    'fitness-os',
    'devhub',
    'historical-tool'
  ])
})
it('keeps the portfolio usable when a configured backend fails', async () => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'publishable')
  mocks.client.mockResolvedValue({})
  mocks.referrals.mockRejectedValue(new Error('unavailable'))
  mocks.projects.mockRejectedValue(new Error('unavailable'))
  const result = await loadPageResources()
  expect(result.experiences[0]?.company.name).toBe('dLocal')
  expect(result.referrals).toEqual([])
  expect(result.projects).toHaveLength(2)
})

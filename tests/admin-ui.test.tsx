// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ProfileEditor } from '../apps/web/features/admin/profile-editor'
import { profile } from '../packages/content/src/profile'
import { profileSchema } from '../packages/lib/src/domain/profile'

const initial = {
  profile: profileSchema.parse(profile),
  revision: 1,
  updatedAt: '2026-10-28'
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it('edits a profile through labeled fields and publishes using its original revision', async () => {
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      ...initial,
      profile: { ...initial.profile, name: 'Updated name' },
      revision: 2
    })
  })
  vi.stubGlobal('fetch', fetcher)
  render(<ProfileEditor initial={initial} />)
  fireEvent.change(screen.getByLabelText('Full name'), {
    target: { value: 'Updated name' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Publish changes' }))
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toContain('Published')
  )
  const payload = JSON.parse(fetcher.mock.calls[0]?.[1].body)
  expect(payload.revision).toBe(1)
  expect(payload.profile.name).toBe('Updated name')
  expect(screen.getByText('Revision 2')).toBeTruthy()
})
it('keeps a draft intact when saving fails', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Another tab changed this profile.' })
    })
  )
  render(<ProfileEditor initial={initial} />)
  fireEvent.change(screen.getByLabelText('Full name'), {
    target: { value: 'Still here' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Publish changes' }))
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain('Another tab')
  )
  expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe(
    'Still here'
  )
})
it('adds a new project through the project editor', () => {
  render(<ProfileEditor initial={initial} />)
  fireEvent.click(screen.getByRole('button', { name: 'Projects' }))
  fireEvent.click(screen.getByRole('button', { name: '+ Add projects' }))
  expect(screen.getAllByLabelText('Project name')).toHaveLength(
    initial.profile.projects.length + 1
  )
})

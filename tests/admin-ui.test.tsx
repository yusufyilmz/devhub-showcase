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
  username: 'yusufyilmz',
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
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toContain('Saved')
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
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
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

it('saves personal PDF settings and publishes only with explicit sharing enabled', async () => {
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ...initial, isPublic: true, revision: 2 })
  })
  vi.stubGlobal('fetch', fetcher)
  render(<ProfileEditor initial={initial} />)
  const share = screen.getByLabelText(
    'Publish my profile and CV at a public link'
  ) as HTMLInputElement
  expect(share.checked).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'PDF' }))
  fireEvent.change(screen.getByLabelText('Page size'), {
    target: { value: 'LETTER' }
  })
  fireEvent.change(screen.getByLabelText('Body text size'), {
    target: { value: '11' }
  })
  fireEvent.click(share)
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() => expect(fetcher).toHaveBeenCalled())
  const payload = JSON.parse(fetcher.mock.calls[0]?.[1].body)
  expect(payload.isPublic).toBe(true)
  expect(payload.profile.cvSettings.pageSize).toBe('LETTER')
  expect(payload.profile.cvSettings.fontSize).toBe(11)
})

it('saves the chosen username together with profile and sharing changes', async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ ...initial, username: 'new-handle', revision: 2 })
    })
  vi.stubGlobal('fetch', fetcher)
  const history = vi
    .spyOn(window.history, 'replaceState')
    .mockImplementation(() => {})
  render(<ProfileEditor initial={initial} />)
  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'new-handle' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toContain('Saved')
  )
  expect(JSON.parse(fetcher.mock.calls[0]?.[1].body).username).toBe(
    'new-handle'
  )
  expect(history).toHaveBeenCalledWith(null, '', '/new-handle/edit')
  history.mockRestore()
})

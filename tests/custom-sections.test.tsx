// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { ProfileEditor } from '../apps/web/features/admin/profile-editor'
import { CustomPortfolioSection } from '../apps/web/features/portfolio/custom-portfolio-section'
import { RegisteredSections } from '../apps/web/features/portfolio/registered-sections'
import {
  type CustomSection,
  customSectionViews,
  getPortfolioEntries,
  getPortfolioSections,
  type PortfolioProfile
} from '../packages/content/src'
import { profile } from '../packages/content/src/profile'
import { profileSchema } from '../packages/lib/src/domain/profile'

const section: CustomSection = {
  id: 'custom-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  title: 'Awards',
  renderer: 'list',
  visible: true,
  items: [
    {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      title: 'Community award',
      body: 'A plain text story.\n\n<script>alert(1)</script>',
      url: 'https://example.com/award'
    }
  ]
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
it('round trips custom sections and mixed ordering while preserving legacy sectionOrder', () => {
  const original = { ...profile, customSections: [section] }
  const legacy = getPortfolioSections(profile).map(({ id }) => id)
  const source: PortfolioProfile = {
    ...original,
    sectionSequence: [section.id, ...legacy]
  }
  const saved = profileSchema.parse(JSON.parse(JSON.stringify(source)))
  expect(saved.customSections).toEqual([section])
  expect(getPortfolioEntries(saved).map(({ id }) => id)).toEqual([
    section.id,
    ...legacy
  ])
  expect(getPortfolioEntries(profile).map(({ id }) => id)).toEqual(legacy)
  expect(getPortfolioEntries(original).at(-1)?.id).toBe(section.id)
  for (const invalid of [
    { ...original, customSections: [section, section] },
    { ...original, sectionSequence: legacy },
    {
      ...original,
      sectionSequence: [
        ...legacy,
        'custom-cccccccc-cccc-4ccc-8ccc-cccccccccccc'
      ]
    },
    { ...original, customSections: [{ ...section, id: 'projects' }] },
    { ...original, customSections: [{ ...section, html: '<script/>' }] },
    {
      ...original,
      customSections: [
        { ...section, items: [section.items[0], section.items[0]] }
      ]
    },
    {
      ...original,
      customSections: [
        {
          ...section,
          items: [{ ...section.items[0], url: 'javascript:alert(1)' }]
        }
      ]
    }
  ])
    expect(profileSchema.safeParse(invalid).success).toBe(false)
})
it('renders every view as escaped content, skips hidden and empty sections and interleaves with built in sections', () => {
  for (const renderer of customSectionViews) {
    const markup = renderToStaticMarkup(
      <CustomPortfolioSection section={{ ...section, renderer }} />
    )
    expect(markup).toContain('Community award')
    expect(markup).toContain('&lt;script&gt;')
    expect(markup).not.toContain('<script>')
  }
  const unsafe = {
    ...section,
    items: section.items.map((item) => ({
      ...item,
      url: 'javascript:alert(1)'
    }))
  }
  expect(
    renderToStaticMarkup(<CustomPortfolioSection section={unsafe} />)
  ).not.toContain('href=')
  expect(
    renderToStaticMarkup(
      <CustomPortfolioSection section={{ ...section, visible: false }} />
    )
  ).toBe('')
  expect(
    renderToStaticMarkup(
      <CustomPortfolioSection section={{ ...section, items: [] }} />
    )
  ).toBe('')
  const saved = {
    ...profile,
    customSections: [section],
    sectionSequence: [
      section.id,
      ...getPortfolioSections(profile).map(({ id }) => id)
    ]
  }
  const markup = renderToStaticMarkup(
    <RegisteredSections
      profile={saved}
      renderers={Object.fromEntries(
        getPortfolioSections(saved).map(({ renderer }) => [
          renderer,
          <section>Existing content</section>
        ])
      )}
    />
  )
  expect(markup.indexOf('Awards')).toBeLessThan(
    markup.indexOf('Existing content')
  )
})
it('creates, duplicates, reorders, removes and saves sections with independent IDs and reloads the saved draft', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const initial = {
    username: 'example-owner',
    profile: profileSchema.parse(profile),
    revision: 1,
    updatedAt: '2026-10-30'
  }
  let saved = initial
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, options) => {
      saved = {
        ...initial,
        profile: profileSchema.parse(JSON.parse(options.body).profile),
        revision: 2
      }
      return { ok: true, json: async () => saved }
    })
  )
  const editor = render(<ProfileEditor initial={initial} />)
  fireEvent.click(screen.getByRole('button', { name: 'Custom sections' }))
  fireEvent.click(screen.getByRole('button', { name: 'Add custom section' }))
  fireEvent.change(screen.getByLabelText('Section name'), {
    target: { value: 'Awards' }
  })
  fireEvent.click(screen.getByRole('button', { name: '+ Add section items' }))
  fireEvent.change(screen.getByLabelText('Item title'), {
    target: { value: 'Community award' }
  })
  fireEvent.change(screen.getByLabelText(/^Item details/), {
    target: { value: 'My story' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Duplicate section' }))
  fireEvent.click(screen.getByRole('button', { name: 'Section order' }))
  fireEvent.keyDown(
    screen.getByRole('button', { name: 'Reorder Awards copy' }),
    { key: 'Home' }
  )
  fireEvent.click(screen.getByRole('button', { name: 'Custom sections' }))
  fireEvent.click(
    within(screen.getByRole('group', { name: 'Awards' })).getByRole('button', {
      name: 'Remove section'
    })
  )
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() => expect(saved.revision).toBe(2))
  expect(saved.profile.customSections).toHaveLength(1)
  expect(saved.profile.customSections?.[0]?.title).toBe('Awards copy')
  expect(saved.profile.sectionSequence?.[0]).toBe(
    saved.profile.customSections?.[0]?.id
  )
  expect(saved.profile.customSections?.[0]?.items[0]?.body).toBe('My story')
  editor.unmount()
  render(<ProfileEditor initial={saved} />)
  fireEvent.click(screen.getByRole('button', { name: 'Custom sections' }))
  expect(
    (screen.getByLabelText('Section name') as HTMLInputElement).value
  ).toBe('Awards copy')
})

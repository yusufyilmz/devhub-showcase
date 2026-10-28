import { readFileSync } from 'node:fs'
import { createCvDefinition, renderCv } from '@shared/cv'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { profile } from '../packages/content/src/profile'

const template = readFileSync(
  new URL('../packages/cv/templates/cv.json.hbs', import.meta.url),
  'utf8'
)
const published = vi.hoisted(() => vi.fn())
vi.mock('../apps/web/lib/published-profile', () => ({
  getPublishedProfile: published
}))

import { GET } from '../apps/web/app/cv.pdf/route'

afterEach(() => vi.resetAllMocks())
describe('CV template', () => {
  it('escapes edited content, preserves unicode and only lists public projects', () => {
    const edited = {
      ...profile,
      name: 'Yusuf "Yılmaz" \\ résumé',
      summary: 'Line one\nLine two "quoted"',
      projects: profile.projects.map((p) => ({
        ...p,
        description: `Edited ${p.name}`
      }))
    }
    const definition = createCvDefinition(edited, template)
    const content = JSON.stringify(definition.content)
    expect(content).toContain(JSON.stringify(edited.name).slice(1, -1))
    expect(content).toContain('Edited Yusuf Fitness OS')
    expect(content).not.toContain('Edited Bank Movements Classifier')
    expect(content).toContain('Boğaziçi University')
    expect(content).toContain('Present')
  })
  it('renders empty optional sections without invalid JSON or dangling headings', () => {
    const definition = createCvDefinition(
      {
        ...profile,
        experiences: [],
        projects: [],
        education: [],
        skills: {},
        languages: [],
        phone: ''
      },
      template
    )
    expect(JSON.stringify(definition.content)).not.toContain('EXPERIENCE')
    expect(JSON.stringify(definition.content)).not.toContain('PUBLIC PROJECTS')
  })
  it('produces a real PDF with bundled fonts without external assets', async () => {
    const pdf = await renderCv(profile, template)
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(pdf.length).toBeGreaterThan(10000)
  })
})
describe('CV download', () => {
  it('uses the latest published profile on each download and sends a PDF attachment', async () => {
    published
      .mockResolvedValueOnce({
        profile: { ...profile, name: 'New Name' },
        revision: 9
      })
      .mockResolvedValueOnce({ profile, revision: 10 })
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    expect(response.headers.get('Content-Disposition')).toContain(
      'New_Name_CV.pdf'
    )
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('X-Profile-Revision')).toBe('9')
    expect(
      Buffer.from(await response.arrayBuffer())
        .subarray(0, 5)
        .toString()
    ).toBe('%PDF-')
    expect((await GET()).headers.get('X-Profile-Revision')).toBe('10')
    expect(published).toHaveBeenCalledTimes(2)
  })
  it('fails clearly when published storage is unavailable', async () => {
    published.mockRejectedValue(new Error('Unavailable'))
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await GET()
    expect(response.status).toBe(503)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    log.mockRestore()
  })
})

it('keeps PDF preferences independent for each profile', () => {
  const custom = {
    ...profile,
    appearance: { accent: 'violet' as const, defaultTheme: 'light' as const },
    cvSettings: {
      pageSize: 'LETTER' as const,
      fontSize: 11 as const,
      showEmail: false,
      showPhone: false,
      includeProjects: false,
      includeLanguages: false
    }
  }
  const definition = createCvDefinition(custom, template)
  expect(definition.pageSize).toBe('LETTER')
  expect(definition.defaultStyle?.fontSize).toBe(11)
  expect(JSON.stringify(definition.content)).not.toContain(profile.email)
  expect(JSON.stringify(definition.content)).not.toContain(profile.phone)
  expect(JSON.stringify(definition.content)).not.toContain('PUBLIC PROJECTS')
  expect(JSON.stringify(definition.content)).not.toContain('LANGUAGES')
  expect(createCvDefinition(profile, template).pageSize).toBe('A4')
})

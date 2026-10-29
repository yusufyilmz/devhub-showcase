import type { PortfolioProfile } from '@shared/content'
import Handlebars from 'handlebars'
import pdfmake from 'pdfmake'
import fonts from 'pdfmake/build/vfs_fonts.js'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

// The server and Plop share an in-memory font filesystem; no host font paths.
const virtualfs = (
  pdfmake as typeof pdfmake & {
    virtualfs: { writeFileSync: (path: string, data: Buffer) => void }
  }
).virtualfs
for (const [name, data] of Object.entries(fonts)) {
  virtualfs.writeFileSync(name, Buffer.from(data, 'base64'))
}
pdfmake.addFonts({
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
})
// CVs contain text and links only. Never fetch assets supplied by profile data.
pdfmake.setUrlAccessPolicy(() => false)
pdfmake.setLocalAccessPolicy(() => false)

const month = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
})
const period = (start: string, end: string | null) =>
  `${month.format(new Date(start))} - ${end ? month.format(new Date(end)) : 'Present'}`

/** Shared with Plop so JSON escaping is identical in CLI and website output. */
export const cvHelpers = {
  json: (value: unknown) => JSON.stringify(value ?? '')
}

const cvFormats = {
  classic: {
    cvNameSize: 25,
    cvTitleSize: 12,
    cvPageMargins: [44, 36, 44, 44],
    cvLineHeight: 1.2,
    cvSectionMargin: [0, 15, 0, 7]
  },
  editorial: {
    cvNameSize: 34,
    cvTitleSize: 14,
    cvPageMargins: [50, 48, 50, 48],
    cvLineHeight: 1.2,
    cvSectionMargin: [0, 22, 0, 10]
  },
  compact: {
    cvNameSize: 22,
    cvTitleSize: 12,
    cvPageMargins: [36, 28, 36, 36],
    cvLineHeight: 1.08,
    cvSectionMargin: [0, 10, 0, 5]
  }
}
export function createCvData(profile: PortfolioProfile) {
  return {
    ...profile,
    ...cvFormats[profile.cvLayout ?? 'classic'],
    cvPageSize: profile.cvSettings?.pageSize ?? 'A4',
    cvFontSize: profile.cvSettings?.fontSize ?? 9,
    cvAccent:
      profile.appearance?.accent === 'violet'
        ? '#6f45b1'
        : profile.appearance?.accent === 'emerald'
          ? '#0e7156'
          : '#096b83',
    email: profile.cvSettings?.showEmail === false ? '' : profile.email,
    phone: profile.cvSettings?.showPhone === false ? '' : profile.phone,
    languages:
      profile.cvSettings?.includeLanguages === false ? [] : profile.languages,
    emailLink: `mailto:${profile.email}`,
    skillGroups: Object.entries(profile.skills).map(([name, values]) => ({
      name,
      description: values.join(', ')
    })),
    experiences: profile.experiences.map((item) => ({
      ...item,
      period: period(item.start, item.end)
    })),
    projects:
      profile.cvSettings?.includeProjects === false
        ? []
        : profile.projects.filter((item) => item.public),
    education: profile.education.map((item) => ({
      ...item,
      period: period(item.start, item.end)
    }))
  }
}

export function createCvDefinition(
  profile: PortfolioProfile,
  template: string,
  render?: (template: string, data: ReturnType<typeof createCvData>) => string
): TDocumentDefinitions {
  const data = createCvData(profile)
  const engine = Handlebars.create()
  engine.registerHelper(cvHelpers)
  const json = render
    ? render(template, data)
    : engine.compile(template, { strict: true, noEscape: true })(data)
  const definition = JSON.parse(json) as TDocumentDefinitions
  definition.info = {
    title: `${profile.name} | CV`,
    author: profile.name,
    subject: profile.title,
    creator: 'DevHub CV template'
  }
  definition.pageBreakBefore = (node, queries) =>
    node.headlineLevel === 1 && queries.getFollowingNodesOnPage().length === 0
  definition.footer = (page, count) => ({
    columns: [
      { text: profile.name, alignment: 'left' },
      { text: `${page} / ${count}`, alignment: 'right' }
    ],
    margin: [44, 14, 44, 0],
    fontSize: 8,
    color: '#64748b'
  })
  return definition
}

export async function renderCv(
  profile: PortfolioProfile,
  template: string,
  render?: Parameters<typeof createCvDefinition>[2]
): Promise<Buffer> {
  return pdfmake
    .createPdf(createCvDefinition(profile, template, render))
    .getBuffer()
}

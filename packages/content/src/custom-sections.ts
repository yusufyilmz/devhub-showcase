import type {
  AuthorableSectionType,
  SectionOptions,
  SectionSource
} from './authorable-sections'
import { getPortfolioSections } from './portfolio-sections'
import type { PortfolioProfile } from './profile'
import type { SectionComposition } from './section-compositions'

export const customSectionViews = [
  'list',
  'cards',
  'accordion',
  'tabs',
  'carousel',
  'timeline',
  'gallery',
  'masonry',
  'steps',
  'text'
] as const
export type CustomSectionId = `custom-${string}`
export type CustomSection = {
  id: CustomSectionId
  title: string
  composition?: SectionComposition
  sectionType?: AuthorableSectionType
  source?: SectionSource
  options?: SectionOptions
  renderer: (typeof customSectionViews)[number]
  visible: boolean
  items: {
    id: string
    title: string
    body: string
    url: string
    value?: string
    period?: string
    details?: string[]
    code?: string
    captionsUrl?: string
    imageUrl?: string
  }[]
}
export type PortfolioEntryId =
  | ReturnType<typeof getPortfolioSections>[number]['id']
  | CustomSectionId
/** Shared ordering adapter; legacy sectionOrder keeps its original six-section contract. */
export function getPortfolioEntries(profile: PortfolioProfile) {
  const entries = [
    ...getPortfolioSections(profile).map((section) => ({
      ...section,
      title: section.kind
    })),
    ...(profile.customSections ?? []).map((section) => ({
      ...section,
      kind: 'custom' as const
    }))
  ]
  const byId = new Map(entries.map((section) => [section.id, section]))
  return [
    ...new Set([
      ...(profile.sectionSequence ?? []),
      ...entries.map(({ id }) => id)
    ])
  ].flatMap((id) => {
    const section = byId.get(id)
    return section ? [section] : []
  })
}

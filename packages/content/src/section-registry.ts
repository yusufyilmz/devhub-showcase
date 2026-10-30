import type { PortfolioSectionId } from './portfolio-sections'
import type { PortfolioType } from './portfolio-types'

type Definition = {
  name: string
  source: string
  renderers: readonly [string, ...string[]]
  defaults: Record<PortfolioType, string>
}
/** Only implemented renderers belong here. No runtime component paths or user code. */
export const sectionRegistry = {
  about: {
    source: 'about',
    name: 'About',
    renderers: ['about-card', 'prose', 'about-accordion'],
    defaults: {
      engineer: 'about-card',
      designer: 'prose',
      consultant: 'prose',
      minimal: 'prose'
    }
  },
  experience: {
    source: 'experiences',
    name: 'Experience',
    renderers: [
      'timeline',
      'experience-list',
      'experience-cards',
      'experience-accordion',
      'experience-tabs'
    ],
    defaults: {
      engineer: 'timeline',
      designer: 'experience-list',
      consultant: 'experience-list',
      minimal: 'experience-list'
    }
  },
  projects: {
    source: 'projects',
    name: 'Projects',
    renderers: [
      'project-cards',
      'project-gallery',
      'project-list',
      'project-carousel',
      'project-accordion',
      'project-tabs'
    ],
    defaults: {
      engineer: 'project-cards',
      designer: 'project-gallery',
      consultant: 'project-list',
      minimal: 'project-list'
    }
  },
  skills: {
    source: 'skills',
    name: 'Skills',
    renderers: ['skill-groups', 'skill-list', 'skill-cards', 'skill-accordion'],
    defaults: {
      engineer: 'skill-groups',
      designer: 'skill-list',
      consultant: 'skill-list',
      minimal: 'skill-list'
    }
  },
  education: {
    source: 'education',
    name: 'Education',
    renderers: [
      'education-timeline',
      'education-list',
      'education-cards',
      'education-accordion'
    ],
    defaults: {
      engineer: 'education-timeline',
      designer: 'education-list',
      consultant: 'education-list',
      minimal: 'education-list'
    }
  },
  languages: {
    source: 'languages',
    name: 'Languages',
    renderers: ['language-list', 'language-cards'],
    defaults: {
      engineer: 'language-list',
      designer: 'language-list',
      consultant: 'language-list',
      minimal: 'language-list'
    }
  }
} as const satisfies Record<PortfolioSectionId, Definition>

export type SectionRendererId =
  (typeof sectionRegistry)[PortfolioSectionId]['renderers'][number]
/** Content identity, presentation and binding are separate JSON values. */
export type PortfolioSection = {
  [Kind in PortfolioSectionId]: {
    id: Kind
    kind: Kind
    renderer: (typeof sectionRegistry)[Kind]['renderers'][number]
    source: { type: 'profile'; field: (typeof sectionRegistry)[Kind]['source'] }
    settings: { visible: boolean }
  }
}[PortfolioSectionId]

export type PortfolioSectionSettings = Partial<{
  [Kind in PortfolioSectionId]: {
    renderer?: (typeof sectionRegistry)[Kind]['renderers'][number]
    visible?: boolean
    itemIds?: string[]
  }
}>

/** Explicit implementations shared by the editor and public section dispatcher. */
export const sectionRendererViews = {
  'about-card': 'cards',
  prose: 'paragraphs',
  'about-accordion': 'accordion',
  timeline: 'timeline',
  'experience-list': 'list',
  'experience-cards': 'cards',
  'experience-accordion': 'accordion',
  'experience-tabs': 'tabs',
  'project-cards': 'cards',
  'project-gallery': 'gallery',
  'project-list': 'list',
  'project-carousel': 'carousel',
  'project-accordion': 'accordion',
  'project-tabs': 'tabs',
  'skill-groups': 'cards',
  'skill-list': 'list',
  'skill-cards': 'cards',
  'skill-accordion': 'accordion',
  'education-timeline': 'timeline',
  'education-list': 'list',
  'education-cards': 'cards',
  'education-accordion': 'accordion',
  'language-list': 'list',
  'language-cards': 'cards'
} as const satisfies Record<SectionRendererId, string>

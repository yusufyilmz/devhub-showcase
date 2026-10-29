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
    renderers: ['about-card', 'prose'],
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
    renderers: ['timeline', 'experience-list'],
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
    renderers: ['project-cards', 'project-gallery', 'project-list'],
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
    renderers: ['skill-groups', 'skill-list'],
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
    renderers: ['education-timeline', 'education-list'],
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
    renderers: ['language-list'],
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

import type { PortfolioType } from './portfolio-types'
import {
  type PortfolioSection,
  type PortfolioSectionSettings,
  sectionRegistry
} from './section-registry'

export const portfolioSectionIds = [
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'languages'
] as const
export type PortfolioSectionId = (typeof portfolioSectionIds)[number]
export const portfolioSectionLabels: Record<PortfolioSectionId, string> =
  Object.fromEntries(
    portfolioSectionIds.map((id) => [id, sectionRegistry[id].name])
  ) as Record<PortfolioSectionId, string>
export type PortfolioSectionPreferences = {
  portfolioType?: PortfolioType
  sectionOrder?: PortfolioSectionId[]
  sectionSettings?: PortfolioSectionSettings
}
export function getPortfolioSectionOrder(
  profile: PortfolioSectionPreferences
): PortfolioSectionId[] {
  const defaults: PortfolioSectionId[] =
    profile.portfolioType === 'designer'
      ? ['projects', 'about', 'experience', 'skills', 'education', 'languages']
      : [...portfolioSectionIds]
  return [...new Set([...(profile.sectionOrder ?? []), ...defaults])]
}

/** Read adapter for existing saved documents. Never mutates or persists profile data. */
export function getPortfolioSections(
  profile: PortfolioSectionPreferences
): PortfolioSection[] {
  const layout = profile.portfolioType ?? 'engineer'
  return getPortfolioSectionOrder(profile).map(
    (kind) =>
      ({
        id: kind,
        kind,
        renderer:
          profile.sectionSettings?.[kind]?.renderer ??
          sectionRegistry[kind].defaults[layout],
        source: { type: 'profile', field: sectionRegistry[kind].source },
        settings: { visible: profile.sectionSettings?.[kind]?.visible ?? true }
      }) as PortfolioSection
  )
}

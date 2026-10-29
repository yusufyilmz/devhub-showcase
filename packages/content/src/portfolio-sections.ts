import type { PortfolioType } from './portfolio-types'

export const portfolioSectionIds = [
  'about',
  'experience',
  'projects',
  'skills',
  'education',
  'languages'
] as const
export type PortfolioSectionId = (typeof portfolioSectionIds)[number]
export const portfolioSectionLabels: Record<PortfolioSectionId, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  languages: 'Languages'
}
export function getPortfolioSectionOrder(profile: {
  portfolioType?: PortfolioType
  sectionOrder?: PortfolioSectionId[]
}): PortfolioSectionId[] {
  const defaults: PortfolioSectionId[] =
    profile.portfolioType === 'designer'
      ? ['projects', 'about', 'experience', 'skills', 'education', 'languages']
      : [...portfolioSectionIds]
  return [...new Set([...(profile.sectionOrder ?? []), ...defaults])]
}

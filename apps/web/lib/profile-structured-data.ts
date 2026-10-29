import { copy, type PortfolioProfile } from '@shared/content'
import { platformStructuredData } from './platform'

export function getProfileStructuredData(profile?: PortfolioProfile) {
  if (!profile) return platformStructuredData
  const currentRole = profile.experiences.find((item) => !item.end)
  return {
    ...copy.structuredData,
    name: profile.name,
    url: profile.website,
    jobTitle: profile.title,
    description: profile.summary,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: Object.values(profile.skills).flat(),
    alumniOf: profile.education.map((item) => ({
      '@type': 'CollegeOrUniversity',
      name: item.institution
    })),
    worksFor: currentRole
      ? { '@type': 'Organization', name: currentRole.company }
      : undefined
  }
}

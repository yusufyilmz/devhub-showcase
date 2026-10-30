import type { PortfolioProfile } from '@shared/content'
import { platformStructuredData } from './platform'

export function getProfileStructuredData(
  profile?: PortfolioProfile,
  canonicalUrl?: string
) {
  if (!profile) return platformStructuredData
  const currentRole = profile.experiences.find((item) => !item.end)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: canonicalUrl ?? profile.website,
    jobTitle: profile.title,
    description: profile.summary,
    sameAs: [profile.github, profile.linkedin, profile.website].filter(Boolean),
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

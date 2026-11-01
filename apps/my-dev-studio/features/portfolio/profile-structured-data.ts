import type { PortfolioProfile } from "@shared/config";

import { platformStructuredData } from "@/features/platform/platform";

export function getProfileStructuredData(profile?: PortfolioProfile, canonicalUrl?: string) {
  if (!profile) return platformStructuredData;
  const currentRole = profile.experiences.find((item) => !item.end);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    alumniOf: profile.education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.institution,
    })),
    description: profile.summary,
    jobTitle: profile.title,
    knowsAbout: Object.values(profile.skills).flat(),
    name: profile.name,
    sameAs: [profile.github, profile.linkedin, profile.website].filter(Boolean),
    url: canonicalUrl ?? profile.website,
    worksFor: currentRole ? { "@type": "Organization", name: currentRole.company } : undefined,
  };
}

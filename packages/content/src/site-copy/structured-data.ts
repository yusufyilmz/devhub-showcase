import { profile } from "../profile";
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.website,
  sameAs: [profile.linkedin, profile.github],
  jobTitle: profile.title,
  worksFor: { "@type": "Organization", name: "dLocal" },
  alumniOf: profile.education.map((item) => ({
    "@type": "CollegeOrUniversity",
    name: item.institution,
  })),
  knowsAbout: Object.values(profile.skills).flat(),
  description: profile.summary,
};

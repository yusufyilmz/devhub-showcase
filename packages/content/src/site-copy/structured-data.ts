import { profile } from "../profile";
export const structuredData = {
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
  sameAs: [profile.linkedin, profile.github],
  url: profile.website,
  worksFor: { "@type": "Organization", name: "dLocal" },
};

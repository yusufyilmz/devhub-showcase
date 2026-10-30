import type { PortfolioSectionId } from "./portfolio-sections";
import type { PortfolioProfile } from "./profile";

/** Portfolio presentation only. PDF and authored records keep their full content. */
export function selectPortfolioContent(
  profile: PortfolioProfile,
): PortfolioProfile {
  const selected = (kind: PortfolioSectionId, id: string) => {
    const ids = profile.sectionSettings?.[kind]?.itemIds;
    return ids === undefined || ids.includes(id);
  };
  return {
    ...profile,
    projects: profile.projects.filter(
      (item) => item.public && selected("projects", item.id),
    ),
    experiences: profile.experiences.filter((item) =>
      selected("experience", item.id),
    ),
    education: profile.education.filter((item) =>
      selected("education", item.id),
    ),
    languages: profile.languages.filter((item) =>
      selected("languages", item.id),
    ),
    skills: Object.fromEntries(
      Object.entries(profile.skills).filter(([group]) =>
        selected("skills", group),
      ),
    ),
  };
}

export function getSectionItems(
  profile: PortfolioProfile,
  kind: PortfolioSectionId,
): { id: string; title: string }[] {
  switch (kind) {
    case "about":
      return [];
    case "projects":
      return profile.projects.map((item) => ({
        id: item.id,
        title: `${item.name}${item.public ? "" : " (private)"}`,
      }));
    case "experience":
      return profile.experiences.map((item) => ({
        id: item.id,
        title: `${item.position} · ${item.company}`,
      }));
    case "education":
      return profile.education.map((item) => ({
        id: item.id,
        title: `${item.degree} · ${item.institution}`,
      }));
    case "languages":
      return profile.languages.map((item) => ({
        id: item.id,
        title: item.language,
      }));
    case "skills":
      return Object.keys(profile.skills).map((group) => ({
        id: group,
        title: group,
      }));
  }
}

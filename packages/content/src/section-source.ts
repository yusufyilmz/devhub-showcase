import type { CustomSection } from "./custom-sections";
import { formatPortfolioPeriod } from "./languages";
import type { PortfolioProfile } from "./profile";
export function resolveSectionSource(
  section: CustomSection,
  profile: PortfolioProfile,
): CustomSection {
  const source = section.source;
  if (!source) return section;
  const choose = (id: string) => !source.itemIds || source.itemIds.includes(id);
  let items: CustomSection["items"] = [];
  switch (source.field) {
    case "projects":
      items = profile.projects
        .filter((item) => item.public && choose(item.id))
        .map((item) => ({
          body: item.description,
          details: item.skills,
          id: item.id,
          imageUrl: item.coverImage ?? "",
          title: item.name,
          url: item.url ?? "",
        }));
      break;
    case "experiences":
      items = profile.experiences
        .filter((item) => choose(item.id))
        .map((item) => ({
          body: item.company,
          details: item.achievements,
          id: item.id,
          period: formatPortfolioPeriod(item.start, item.end, profile.portfolioLanguage),
          title: item.position,
          url: item.companyUrl,
        }));
      break;
    case "education":
      items = profile.education
        .filter((item) => choose(item.id))
        .map((item) => ({
          body: `${item.field} · ${item.institution}`,
          id: item.id,
          period: formatPortfolioPeriod(item.start, item.end, profile.portfolioLanguage),
          title: item.degree,
          url: item.url,
        }));
      break;
    case "skills":
      items = Object.entries(profile.skills)
        .filter(([id]) => choose(id))
        .map(([id, details]) => ({
          body: "",
          details,
          id,
          title: id,
          url: "",
        }));
      break;
    case "languages":
      items = profile.languages
        .filter((item) => choose(item.id))
        .map((item) => ({
          body: item.proficiency,
          id: item.id,
          title: item.language,
          url: "",
        }));
      break;
    case "about":
      items = [
        {
          body: (profile.about.length ? profile.about : [profile.summary]).join("\n\n"),
          id: "about",
          title: profile.name,
          url: "",
        },
      ];
      break;
  }
  return { ...section, items };
}

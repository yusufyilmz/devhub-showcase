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
          id: item.id,
          title: item.name,
          body: item.description,
          url: item.url ?? "",
          imageUrl: item.coverImage ?? "",
          details: item.skills,
        }));
      break;
    case "experiences":
      items = profile.experiences
        .filter((item) => choose(item.id))
        .map((item) => ({
          id: item.id,
          title: item.position,
          body: item.company,
          url: item.companyUrl,
          period: formatPortfolioPeriod(
            item.start,
            item.end,
            profile.portfolioLanguage,
          ),
          details: item.achievements,
        }));
      break;
    case "education":
      items = profile.education
        .filter((item) => choose(item.id))
        .map((item) => ({
          id: item.id,
          title: item.degree,
          body: `${item.field} · ${item.institution}`,
          url: item.url,
          period: formatPortfolioPeriod(
            item.start,
            item.end,
            profile.portfolioLanguage,
          ),
        }));
      break;
    case "skills":
      items = Object.entries(profile.skills)
        .filter(([id]) => choose(id))
        .map(([id, details]) => ({
          id,
          title: id,
          body: "",
          url: "",
          details,
        }));
      break;
    case "languages":
      items = profile.languages
        .filter((item) => choose(item.id))
        .map((item) => ({
          id: item.id,
          title: item.language,
          body: item.proficiency,
          url: "",
        }));
      break;
    case "about":
      items = [
        {
          id: "about",
          title: profile.name,
          body: (profile.about.length ? profile.about : [profile.summary]).join(
            "\n\n",
          ),
          url: "",
        },
      ];
      break;
  }
  return { ...section, items };
}

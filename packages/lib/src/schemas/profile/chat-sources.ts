import { buildPublicPortfolioKnowledge } from "./portfolio-knowledge";
import type { ProfileSnapshot } from "./profile-snapshot";

export function publicChatSources(snapshot: ProfileSnapshot) {
  const knowledge = buildPublicPortfolioKnowledge(snapshot);
  if (!knowledge) return [];
  const engineer = !snapshot.profile.portfolioType || snapshot.profile.portfolioType === "engineer";
  const anchors: Record<string, string> = engineer
    ? { about: "about-me", education: "educations", experience: "experiences" }
    : { projects: "work" };
  return knowledge.sections.map((section) => ({
    href: `/${encodeURIComponent(knowledge.source.username)}#${encodeURIComponent(anchors[section.id] ?? section.id)}`,
    label: section.title,
  }));
}

import type { PortfolioProfile } from "@shared/config";

export function cvEvidence(profile: PortfolioProfile) {
  const summary = profile.summary.slice(0, 900);
  const skills = Object.values(profile.skills)
    .flat()
    .slice(0, 50)
    .map((skill) => skill.slice(0, 80));
  const experiences = profile.experiences
    .slice(0, 6)
    .map(({ company, position, achievements }) => ({
      achievements: achievements.slice(0, 4).map((fact) => fact.slice(0, 220)),
      company: company.slice(0, 120),
      position: position.slice(0, 120),
    }));
  if (!summary.trim() && !skills.length && !experiences.length) return null;
  return { experiences, skills, summary, title: profile.title.slice(0, 150) };
}

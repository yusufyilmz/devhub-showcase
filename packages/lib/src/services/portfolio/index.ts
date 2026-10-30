import { profile as initialProfile, type PortfolioProfile } from "@shared/content";

import type { PageResources, Skill } from "../../types";

const timestamp = "2026-10-27T00:00:00.000Z";
const company = (name: string, link: string) => ({
  created_at: timestamp,
  id: name,
  link,
  name,
  updated_at: timestamp,
});
const skill = (name: string): Skill => ({
  createdAt: timestamp,
  experienceYear: null,
  id: name,
  name,
  projects: [],
  type: "Technical",
  updatedAt: timestamp,
});

/** Maps versioned public content to the UI contract; never writes database records. */
export function getPortfolioResources(profile: PortfolioProfile = initialProfile): PageResources {
  const projects = profile.projects.map((item) => ({
    company: company(
      item.company,
      profile.experiences.find((exp) => exp.id === item.experienceId)?.companyUrl ??
        profile.website,
    ),
    description: item.description,
    id: item.id,
    imageUrl: null,
    link: item.url,
    public: item.public,
    role:
      profile.experiences.find((entry) => entry.id === item.experienceId)?.position ?? "Creator",
    skills: item.skills.map(skill),
    sourceUrl: item.sourceUrl,
    title: item.name,
  }));
  return {
    educations: profile.education.map((item) => ({
      createdAt: timestamp,
      degree: item.degree,
      description: null,
      fieldOfStudy: item.field,
      finishedAt: item.end,
      gpa: null,
      id: item.id,
      institution: item.institution,
      institutionLink: item.url,
      startedAt: item.start,
      updatedAt: timestamp,
    })),
    experiences: profile.experiences.map((item) => ({
      achievements: item.achievements,
      company: company(item.company, item.companyUrl),
      companyId: item.id,
      createdAt: timestamp,
      finishedAt: item.end,
      id: item.id,
      projects: projects.filter(
        (project) => profile.projects.find((p) => p.id === project.id)?.experienceId === item.id,
      ),
      role: item.position,
      startedAt: item.start,
      updatedAt: timestamp,
    })),
    projects: projects.filter((item) => item.public),
    referrals: [],
    skills: Object.fromEntries(
      Object.entries(profile.skills).map(([group, names]) => [
        group,
        names.map((name) => ({ ...skill(name), type: group })),
      ]),
    ),
  };
}

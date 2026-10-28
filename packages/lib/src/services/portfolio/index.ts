import {
  profile as initialProfile,
  type PortfolioProfile
} from '@shared/content'
import type { PageResources, Skill } from '../../types'

const timestamp = '2026-10-27T00:00:00.000Z'
const company = (name: string, link: string) => ({
  id: name,
  name,
  link,
  created_at: timestamp,
  updated_at: timestamp
})
const skill = (name: string): Skill => ({
  id: name,
  name,
  type: 'Technical',
  experienceYear: null,
  createdAt: timestamp,
  updatedAt: timestamp,
  projects: []
})

/** Maps versioned public content to the UI contract; never writes database records. */
export function getPortfolioResources(
  profile: PortfolioProfile = initialProfile
): PageResources {
  const projects = profile.projects.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description,
    link: item.url,
    sourceUrl: item.sourceUrl,
    role:
      profile.experiences.find((entry) => entry.id === item.experienceId)
        ?.position ?? 'Creator',
    public: item.public,
    imageUrl: null,
    company: company(
      item.company,
      profile.experiences.find((exp) => exp.id === item.experienceId)
        ?.companyUrl ?? profile.website
    ),
    skills: item.skills.map(skill)
  }))
  return {
    experiences: profile.experiences.map((item) => ({
      id: item.id,
      role: item.position,
      startedAt: item.start,
      finishedAt: item.end,
      createdAt: timestamp,
      updatedAt: timestamp,
      achievements: item.achievements,
      companyId: item.id,
      company: company(item.company, item.companyUrl),
      projects: projects.filter(
        (project) =>
          profile.projects.find((p) => p.id === project.id)?.experienceId ===
          item.id
      )
    })),
    projects: projects.filter((item) => item.public),
    educations: profile.education.map((item) => ({
      id: item.id,
      createdAt: timestamp,
      updatedAt: timestamp,
      institution: item.institution,
      institutionLink: item.url,
      degree: item.degree,
      fieldOfStudy: item.field,
      startedAt: item.start,
      finishedAt: item.end,
      gpa: null,
      description: null
    })),
    skills: Object.fromEntries(
      Object.entries(profile.skills).map(([group, names]) => [
        group,
        names.map((name) => ({ ...skill(name), type: group }))
      ])
    ),
    referrals: []
  }
}

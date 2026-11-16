import {
  type AuthorableSectionType,
  authorableSectionTypes,
  type PortfolioProfile,
} from "@shared/config";
import type {
  Education,
  ExperienceWithCompanyProjectAndSkills,
  ProjectWithCompanyAndSkills,
  Referral,
  Skill,
} from "@shared/lib/types";

import registry from "../../registry/components.json";

export const viewOnlySectionExamples = {
  "about-me": {
    category: "Story",
    description: "Introduce yourself and your work.",
    name: "About Me",
  },
  cv: { category: "Work", description: "Offer a downloadable CV.", name: "CV Download" },
  education: { category: "Work", description: "Show your academic background.", name: "Education" },
  experience: { category: "Work", description: "Lay out your career history.", name: "Experience" },
  languages: {
    category: "Story",
    description: "List the languages you speak and your proficiency.",
    name: "Languages",
  },
  "portfolio-projects": {
    category: "Work",
    description: "Show projects with roles and skills.",
    name: "Portfolio Projects",
  },
  referrals: {
    category: "Connect",
    description: "Share feedback from collaborators.",
    name: "Referrals",
  },
  skills: { category: "Work", description: "Group your areas of expertise.", name: "Skills" },
  summary: {
    category: "Story",
    description: "Give visitors a quick overview of your work.",
    name: "Summary",
  },
} as const;

export type SectionExampleId = AuthorableSectionType | keyof typeof viewOnlySectionExamples;

export const sectionExamples: ReadonlyArray<{
  id: SectionExampleId;
  name: string;
  category: string;
  description: string;
}> = [
  ...authorableSectionTypes.map((id) => ({ id, ...registry.sections[id] })),
  ...Object.entries(viewOnlySectionExamples).map(([id, descriptor]) => ({
    id: id as keyof typeof viewOnlySectionExamples,
    ...descriptor,
  })),
];

const date = "2025-06-01T12:00:00Z";
const company = {
  created_at: date,
  id: "example-studio",
  link: "https://example.com",
  name: "Atlas Studio",
  updated_at: date,
};
const project = {
  company,
  description: "A searchable archive for a local design studio.",
  id: "example-project",
  imageUrl: null,
  link: "https://example.com/archive",
  public: true,
  role: "Product designer",
  skills: [],
  title: "The Atlas archive",
} satisfies ProjectWithCompanyAndSkills;
const skill = {
  createdAt: date,
  experienceYear: null,
  id: "example-skill",
  name: "Interaction design",
  projects: [],
  type: "Design",
  updatedAt: date,
} satisfies Skill;

export const portfolioSectionExamples = {
  education: {
    createdAt: date,
    degree: "MA",
    description: "Studied accessible design for public services.",
    fieldOfStudy: "Interaction Design",
    finishedAt: "2022-06-01",
    gpa: null,
    id: "example-education",
    institution: "North Design School",
    institutionLink: "https://example.com/design-school",
    startedAt: "2020-09-01",
    updatedAt: date,
  } satisfies Education,
  experience: {
    achievements: ["Made reference material easier to discover and share."],
    company,
    companyId: company.id,
    createdAt: date,
    finishedAt: null,
    id: "example-experience",
    projects: [project],
    role: "Product designer",
    startedAt: "2023-06-01",
    updatedAt: date,
  } satisfies ExperienceWithCompanyProjectAndSkills,
  profile: {
    about: ["I work with cultural organizations and research teams."],
    education: [],
    email: "",
    experiences: [],
    github: "",
    languages: [{ id: "example-language", language: "Spanish", proficiency: "Fluent" }],
    linkedin: "",
    location: "Barcelona, Spain",
    name: "Alex Morgan",
    phone: "",
    projects: [],
    skills: {},
    summary: "I design clear, accessible tools for public-interest teams.",
    title: "Independent designer",
    website: "",
  } satisfies PortfolioProfile,
  project,
  referral: {
    contactInfo: null,
    createdAt: date,
    feedback: "Alex made the archive easier for our team to use.",
    id: "example-referral",
    name: "Morgan Lee",
    recommendation: null,
    relationship: "Project collaborator",
    sessionId: "example-session",
    updatedAt: date,
  } satisfies Referral,
  skill,
};

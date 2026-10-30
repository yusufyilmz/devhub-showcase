import { type PortfolioProfile, profile } from "@shared/content";

import type { CVModel } from "../types/cv";

const skills = (names: string[]) =>
  names.map((technology) => ({ technology, yearsOfExperience: "" }));
const year = (date: string) => date.slice(0, 4);
const month = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date));
export function createCVModel(profile: PortfolioProfile): CVModel {
  return {
    achievements: [
      {
        description:
          "Built reusable UI primitives, hooks, contexts and tooling across financial applications with type safety and maintainable delivery.",
        title: "Platform engineering",
      },
      {
        description:
          "Connected interfaces to transaction processing, classification and notification flows, with operational visibility and audit history.",
        title: "Workflow automation",
      },
      {
        description:
          "Worked with stakeholders to turn ambiguous business flows into reliable interfaces and documented integrations.",
        title: "Cross-functional ownership",
      },
    ],
    certifications: [],
    characteristic: {
      adaptability: "",
      attentionToDetail: "",
      careerGoals: { longTerm: "", shortTerm: "" },
      communicationStyle: "",
      innovation: "",
      leadership: { examples: [], philosophy: "" },
      motivation: { longTerm: "", shortTerm: "" },
      problemSolvingApproach: "",
      problemSolvingPhilosophy: "",
      resilience: "",
      strengths: [
        "Technical ownership",
        "Cross-functional collaboration",
        "Mentoring",
        "End-to-end product delivery",
      ],
      teamwork: { examples: [], philosophy: "" },
      weaknesses: [],
      workEthic: { continuousLearning: "", dedication: "", punctuality: "" },
    },
    contact: {
      email: profile.email,
      github: profile.github,
      linkedin: profile.linkedin,
      phone: profile.phone,
    },
    education: profile.education.map((item) => ({
      degree: `${item.degree} ${item.field}`,
      description: "",
      gpa: "",
      university: item.institution,
      years: `${year(item.start)} to ${year(item.end)}`,
    })),
    experience: profile.experiences.map((item) => ({
      company: item.company,
      description: item.achievements.join(" "),
      position: item.position,
      years: `${month(item.start)} to ${item.end ? month(item.end) : "Present"}`,
    })),
    languages: profile.languages,
    overview: { summary: `${profile.title}. ${profile.summary}` },
    personalInformation: {
      age: "",
      birthDate: "",
      fullName: profile.name,
      location: profile.location,
      nationality: "",
    },
    projects: profile.projects.map((project) => ({
      company: project.company,
      description: project.description,
      name: project.name,
      usedSkills: project.skills,
    })),
    referrals: [],
    skills: {
      backend: skills(profile.skills["Backend & data"] ?? []),
      data_visualization: [],
      devops: skills(profile.skills["Platform & quality"] ?? []),
      frontend: skills(Object.values(profile.skills).flat()),
      groups: profile.skills,
      performance_optimization: skills(["SSR", "Frontend platform architecture"]),
      testing: skills(["Jest", "React Testing Library", "Playwright", "Cypress"]),
      version_control: skills(["Git", "GitHub", "GitHub Actions"]),
    },
    technicalChallenges: [],
    workPreferences: { hybrid: "", office: "", remote: "" },
  };
}
export const CV_MODEL = createCVModel(profile);

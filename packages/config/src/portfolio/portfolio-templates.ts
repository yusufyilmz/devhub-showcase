import type { PortfolioProfile } from "../profile/profile";
import type { PortfolioSectionSettings } from "../sections/section-registry";
import type { PortfolioSectionId } from "./portfolio-sections";
import type { PortfolioType } from "./portfolio-types";

type Template = {
  id: string;
  name: string;
  description: string;
  example: string;
  type: PortfolioType;
  order: PortfolioSectionId[];
  renderers: PortfolioSectionSettings;
};
export const portfolioTemplates: Template[] = [
  {
    description: "Career timeline, project cards and grouped technical skills.",
    example: "avery-morgan",
    id: "engineer",
    name: "Engineer · career atlas",
    order: ["about", "experience", "projects", "skills", "education", "languages"],
    renderers: {
      experience: { renderer: "timeline" },
      projects: { renderer: "project-cards" },
      skills: { renderer: "skill-groups" },
    },
    type: "engineer",
  },
  {
    description: "A project gallery followed by process tabs and a concise introduction.",
    example: "maya-chen",
    id: "designer",
    name: "Designer · selected work",
    order: ["projects", "about", "experience", "skills", "education", "languages"],
    renderers: {
      experience: { renderer: "experience-tabs" },
      projects: { renderer: "project-gallery" },
      skills: { renderer: "skill-cards" },
    },
    type: "designer",
  },
  {
    description: "An image-led carousel with a quiet biography and compact credentials.",
    example: "lena-park",
    id: "photographer",
    name: "Photographer · contact sheet",
    order: ["projects", "about", "skills", "experience", "education", "languages"],
    renderers: {
      about: { renderer: "prose" },
      experience: { renderer: "experience-accordion" },
      projects: { renderer: "project-carousel" },
    },
    type: "designer",
  },
  {
    description: "A side-by-side introduction, expandable case studies and expertise cards.",
    example: "noah-bell",
    id: "freelancer",
    name: "Freelancer · independent practice",
    order: ["about", "projects", "skills", "experience", "education", "languages"],
    renderers: {
      experience: { renderer: "experience-tabs" },
      projects: { renderer: "project-accordion" },
      skills: { renderer: "skill-cards" },
    },
    type: "consultant",
  },
  {
    description: "Education first, course projects and a developing skills collection.",
    example: "ada-woods",
    id: "student",
    name: "Student · first chapters",
    order: ["education", "projects", "skills", "about", "experience", "languages"],
    renderers: {
      education: { renderer: "education-timeline" },
      projects: { renderer: "project-cards" },
      skills: { renderer: "skill-cards" },
    },
    type: "minimal",
  },
  {
    description: "A collection carousel, store experience cards and product expertise.",
    example: "robin-lane",
    id: "retail",
    name: "Retail · collection journal",
    order: ["projects", "experience", "skills", "about", "education", "languages"],
    renderers: {
      experience: { renderer: "experience-cards" },
      projects: { renderer: "project-carousel" },
      skills: { renderer: "skill-list" },
    },
    type: "creator",
  },
  {
    description: "A persistent introduction beside case-study tabs and a career timeline.",
    example: "alex-rivera",
    id: "consultant",
    name: "Consultant · evidence and approach",
    order: ["projects", "experience", "about", "skills", "education", "languages"],
    renderers: {
      experience: { renderer: "timeline" },
      projects: { renderer: "project-tabs" },
      skills: { renderer: "skill-cards" },
    },
    type: "consultant",
  },
  {
    description: "Program cards, a qualification timeline and expandable coaching expertise.",
    example: "priya-shah",
    id: "trainer",
    name: "Trainer · coaching programs",
    order: ["projects", "skills", "education", "experience", "about", "languages"],
    renderers: {
      education: { renderer: "education-timeline" },
      projects: { renderer: "project-cards" },
      skills: { renderer: "skill-accordion" },
    },
    type: "trainer",
  },
  {
    description: "Featured writing, editorial archives and an uncluttered biography.",
    example: "jamie-reed",
    id: "blogger",
    name: "Blogger · field notes",
    order: ["projects", "about", "experience", "skills", "education", "languages"],
    renderers: {
      about: { renderer: "prose" },
      experience: { renderer: "experience-accordion" },
      projects: { renderer: "project-list" },
    },
    type: "minimal",
  },
];
/** Presentation only: never copy sample facts or change visibility, selection, or PDF choices. */
export function applyPortfolioTemplate(profile: PortfolioProfile, id: string): PortfolioProfile {
  const template = portfolioTemplates.find((item) => item.id === id);
  if (!template) throw new Error("Unknown portfolio template.");
  const sectionSettings = { ...profile.sectionSettings };
  for (const kind of template.order) {
    const renderer = template.renderers[kind]?.renderer;
    if (renderer)
      Object.assign(sectionSettings, { [kind]: { ...sectionSettings[kind], renderer } });
  }
  const customIds = (profile.customSections ?? []).map((section) => section.id);
  const orderedCustomIds = [
    ...new Set([
      ...(profile.sectionSequence ?? []).filter((key) =>
        customIds.includes(key as (typeof customIds)[number]),
      ),
      ...customIds,
    ]),
  ];
  return {
    ...profile,
    portfolioType: template.type,
    sectionOrder: [...template.order],
    sectionSequence: [...template.order, ...orderedCustomIds],
    sectionSettings,
    templateChosen: true,
  };
}

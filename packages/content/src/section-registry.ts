import type { PortfolioSectionId } from "./portfolio-sections";
import type { PortfolioType } from "./portfolio-types";

type Definition = {
  name: string;
  source: string;
  renderers: readonly [string, ...string[]];
  defaults: Record<PortfolioType, string>;
};
/** Only implemented renderers belong here. No runtime component paths or user code. */
export const sectionRegistry = {
  about: {
    defaults: {
      consultant: "prose",
      designer: "prose",
      engineer: "about-card",
      minimal: "prose",
    },
    name: "About",
    renderers: ["about-card", "prose", "about-accordion"],
    source: "about",
  },
  education: {
    defaults: {
      consultant: "education-list",
      designer: "education-list",
      engineer: "education-timeline",
      minimal: "education-list",
    },
    name: "Education",
    renderers: ["education-timeline", "education-list", "education-cards", "education-accordion"],
    source: "education",
  },
  experience: {
    defaults: {
      consultant: "experience-list",
      designer: "experience-list",
      engineer: "timeline",
      minimal: "experience-list",
    },
    name: "Experience",
    renderers: [
      "timeline",
      "experience-list",
      "experience-cards",
      "experience-accordion",
      "experience-tabs",
    ],
    source: "experiences",
  },
  languages: {
    defaults: {
      consultant: "language-list",
      designer: "language-list",
      engineer: "language-list",
      minimal: "language-list",
    },
    name: "Languages",
    renderers: ["language-list", "language-cards"],
    source: "languages",
  },
  projects: {
    defaults: {
      consultant: "project-list",
      designer: "project-gallery",
      engineer: "project-cards",
      minimal: "project-list",
    },
    name: "Projects",
    renderers: [
      "project-cards",
      "project-gallery",
      "project-list",
      "project-carousel",
      "project-accordion",
      "project-tabs",
    ],
    source: "projects",
  },
  skills: {
    defaults: {
      consultant: "skill-list",
      designer: "skill-list",
      engineer: "skill-groups",
      minimal: "skill-list",
    },
    name: "Skills",
    renderers: ["skill-groups", "skill-list", "skill-cards", "skill-accordion"],
    source: "skills",
  },
} as const satisfies Record<PortfolioSectionId, Definition>;

export type SectionRendererId = (typeof sectionRegistry)[PortfolioSectionId]["renderers"][number];
/** Content identity, presentation and binding are separate JSON values. */
export type PortfolioSection = {
  [Kind in PortfolioSectionId]: {
    id: Kind;
    kind: Kind;
    renderer: (typeof sectionRegistry)[Kind]["renderers"][number];
    source: {
      type: "profile";
      field: (typeof sectionRegistry)[Kind]["source"];
    };
    settings: { visible: boolean };
  };
}[PortfolioSectionId];

export type PortfolioSectionSettings = Partial<{
  [Kind in PortfolioSectionId]: {
    renderer?: (typeof sectionRegistry)[Kind]["renderers"][number];
    visible?: boolean;
    itemIds?: string[];
  };
}>;

/** Explicit implementations shared by the editor and public section dispatcher. */
export const sectionRendererViews = {
  "about-accordion": "accordion",
  "about-card": "cards",
  "education-accordion": "accordion",
  "education-cards": "cards",
  "education-list": "list",
  "education-timeline": "timeline",
  "experience-accordion": "accordion",
  "experience-cards": "cards",
  "experience-list": "list",
  "experience-tabs": "tabs",
  "language-cards": "cards",
  "language-list": "list",
  "project-accordion": "accordion",
  "project-cards": "cards",
  "project-carousel": "carousel",
  "project-gallery": "gallery",
  "project-list": "list",
  "project-tabs": "tabs",
  prose: "paragraphs",
  "skill-accordion": "accordion",
  "skill-cards": "cards",
  "skill-groups": "cards",
  "skill-list": "list",
  timeline: "timeline",
} as const satisfies Record<SectionRendererId, string>;

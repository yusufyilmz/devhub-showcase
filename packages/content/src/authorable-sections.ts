/** Explicit, portable metadata; no component paths or executable configuration. */
export const authorableSections = {
  about: { name: "About", sources: ["about"], view: "about" },
  "about-hero": { name: "About Hero", sources: ["about"], view: "hero" },
  accordion: { name: "Accordion", sources: [], view: "accordion" },
  awards: { name: "Awards", sources: [], view: "awards" },
  "blog-page": { name: "Blog Page", sources: [], view: "posts" },
  "calendar-link": { name: "Calendar Link", sources: [], view: "links" },
  careers: { name: "Careers", sources: [], view: "careers" },
  clients: { name: "Clients", sources: [], view: "clients" },
  "contact-form": { name: "Contact Form", sources: [], view: "contact" },
  "contact-info": { name: "Contact Info", sources: [], view: "links" },
  cta: { name: "CTA", sources: [], view: "cards" },
  custom: {
    name: "Custom",
    sources: ["projects", "experiences", "skills", "education", "languages", "about"],
    view: "list",
  },
  faq: { name: "FAQ", sources: [], view: "accordion" },
  features: {
    name: "Features",
    sources: ["projects", "skills"],
    view: "cards",
  },
  "gallery-grid": {
    name: "Gallery Grid",
    sources: ["projects"],
    view: "gallery",
  },
  heading: { name: "Heading", sources: [], view: "heading" },
  hero: { name: "Hero", sources: [], view: "hero" },
  "how-to": { name: "How To", sources: [], view: "steps" },
  instagram: { name: "Instagram", sources: [], view: "gallery" },
  "legal-text": { name: "Legal Text", sources: [], view: "text" },
  map: { name: "Map", sources: [], view: "map" },
  menu: { name: "Menu", sources: [], view: "menu" },
  newsletter: { name: "Newsletter", sources: [], view: "newsletter" },
  pinterest: { name: "Pinterest", sources: [], view: "gallery" },
  plans: { name: "Plans", sources: [], view: "pricing" },
  "posts-grid": { name: "Posts Grid", sources: [], view: "posts" },
  pricing: { name: "Pricing", sources: [], view: "pricing" },
  profile: { name: "Profile", sources: [], view: "profile" },
  projects: { name: "Projects", sources: ["projects"], view: "projects" },
  property: { name: "Property", sources: [], view: "property" },
  quickstart: { name: "Quickstart", sources: [], view: "steps" },
  services: { name: "Services", sources: [], view: "cards" },
  "shop-items": { name: "Shop Items", sources: [], view: "shop" },
  showcase: { name: "Showcase", sources: ["projects"], view: "gallery" },
  "social-links": { name: "Social Links", sources: [], view: "links" },
  stats: { name: "Stats", sources: [], view: "statistics" },
  studies: { name: "Studies", sources: ["education"], view: "timeline" },
  "table-of-contents": { name: "Table Of Contents", sources: [], view: "toc" },
  tabs: { name: "Tabs", sources: [], view: "tabs" },
  team: { name: "Team", sources: [], view: "team" },
  "technical-skills": {
    name: "Technical Skills",
    sources: ["skills"],
    view: "skills",
  },
  testimonials: { name: "Testimonials", sources: [], view: "quotes" },
  text: { name: "Text", sources: ["about"], view: "text" },
  timeline: {
    name: "Timeline",
    sources: ["experiences", "education"],
    view: "timeline",
  },
  video: { name: "Video", sources: [], view: "video" },
  "work-experience": {
    name: "Work Experience",
    sources: ["experiences"],
    view: "timeline",
  },
  youtube: { name: "YouTube", sources: [], view: "video" },
} as const;
export type AuthorableSectionType = keyof typeof authorableSections;
export const authorableSectionTypes = [
  "about-hero",
  "about",
  "accordion",
  "awards",
  "blog-page",
  "cta",
  "calendar-link",
  "careers",
  "clients",
  "contact-form",
  "contact-info",
  "faq",
  "features",
  "gallery-grid",
  "heading",
  "hero",
  "how-to",
  "legal-text",
  "map",
  "menu",
  "newsletter",
  "plans",
  "posts-grid",
  "pricing",
  "profile",
  "projects",
  "property",
  "quickstart",
  "shop-items",
  "showcase",
  "social-links",
  "stats",
  "studies",
  "table-of-contents",
  "tabs",
  "team",
  "technical-skills",
  "testimonials",
  "text",
  "timeline",
  "video",
  "work-experience",
  "custom",
  "services",
  "youtube",
  "instagram",
  "pinterest",
] as const;
export type SectionSourceField =
  | "projects"
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "about";
export type SectionSource = {
  type: "profile";
  field: SectionSourceField;
  itemIds?: string[];
};
export type SectionOptions = {
  description?: string;
  alignment?: "left" | "center" | "right";
  columns?: 1 | 2 | 3 | 4;
  email?: string;
  actionUrl?: string;
  latitude?: number;
  longitude?: number;
  mediaUrl?: string;
  posterUrl?: string;
};

export function getSectionRenderers(type: AuthorableSectionType) {
  if (type === "custom")
    return [
      "list",
      "cards",
      "gallery",
      "masonry",
      "carousel",
      "accordion",
      "tabs",
      "timeline",
      "steps",
      "text",
    ] as const;
  const view = authorableSections[type].view;
  if (["contact", "map", "toc", "hero", "heading", "newsletter"].includes(view))
    return ["list"] as const;
  if (["gallery", "clients"].includes(view))
    return ["gallery", "masonry", "carousel", "cards"] as const;
  if (view === "timeline") return ["timeline", "list", "cards"] as const;
  if (view === "steps") return ["steps", "list", "cards"] as const;
  if (view === "accordion") return ["accordion", "cards", "list"] as const;
  if (view === "tabs") return ["tabs", "accordion", "list"] as const;
  if (view === "text") return ["text", "list"] as const;
  return ["cards", "list", "gallery", "carousel", "accordion", "tabs"] as const;
}
export const MAX_CUSTOM_SECTIONS = 60;

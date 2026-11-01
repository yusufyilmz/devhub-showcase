export const portfolioTypes = [
  {
    audience: "Software engineers and technical specialists",
    cvLayout: "classic",
    description: "A detailed career timeline, technical skills and projects.",
    id: "engineer",
    name: "Engineer",
  },
  {
    audience: "Designers, photographers and visual creators",
    cvLayout: "editorial",
    description: "A bold introduction and a visual gallery of selected work.",
    id: "designer",
    name: "Designer",
  },
  {
    audience: "Consultants, freelancers and business professionals",
    cvLayout: "classic",
    description: "A personal introduction alongside experience and client work.",
    id: "consultant",
    name: "Consultant",
  },
  {
    audience: "Writers, researchers and anyone who prefers simplicity",
    cvLayout: "compact",
    description: "A quiet, single column page that lets your story do the talking.",
    id: "minimal",
    name: "Minimal",
  },
] as const;
export type PortfolioType = (typeof portfolioTypes)[number]["id"];
export const cvLayouts = [
  { description: "The original balanced CV.", id: "classic", name: "Classic" },
  {
    description: "A larger name and generous spacing.",
    id: "editorial",
    name: "Editorial",
  },
  {
    description: "Tighter spacing for a longer career.",
    id: "compact",
    name: "Compact",
  },
] as const;
export type CvLayout = (typeof cvLayouts)[number]["id"];

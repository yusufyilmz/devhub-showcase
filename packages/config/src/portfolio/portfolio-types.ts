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
  {
    audience: "Fitness coaches, tutors and personal trainers",
    cvLayout: "classic",
    description: "Programs, client results and the credentials behind your coaching.",
    id: "trainer",
    name: "Trainer",
  },
  {
    audience: "Creators who publish ongoing media and paid memberships",
    cvLayout: "editorial",
    description: "A visual page for featured posts, series and a clear way to subscribe.",
    id: "creator",
    name: "Content creator",
  },
] as const;
export type PortfolioType = (typeof portfolioTypes)[number]["id"];
export const cvLayouts = [
  {
    description:
      "Single-column text with clear headings and visible URLs; compatibility varies by ATS.",
    id: "ats",
    name: "ATS-friendly",
  },
  {
    description: "The same logical reading order with tighter spacing for longer careers.",
    id: "ats-compact",
    name: "ATS-friendly compact",
  },
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

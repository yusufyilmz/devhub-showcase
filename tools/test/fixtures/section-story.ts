import {
  type AuthorableSectionType,
  authorableSections,
  getSectionRenderers,
} from "../../../packages/config/src/sections/authorable-sections";
import type { CustomSection } from "../../../packages/config/src/sections/custom-sections";
import type { SectionProps } from "../../../packages/ui/src/sections/types";

type StoryItem = CustomSection["items"][number];
type StoryContent = {
  title: string;
  description: string;
  items?: (Omit<StoryItem, "id" | "url"> & { url?: string })[];
  options?: CustomSection["options"];
};

const exampleUrl = (file: string) =>
  new URL(`./examples/${file}.svg`, globalThis.location?.href ?? "http://localhost:6006/").href;

const atlas = {
  body: "A dashboard that makes research easier to navigate.",
  imageUrl: exampleUrl("atlas-interface"),
  title: "Atlas interface",
};
const orbit = {
  body: "A visual identity for a neighborhood arts festival.",
  imageUrl: exampleUrl("orbit-brand"),
  title: "Orbit identity",
};
const form = {
  body: "Experiments in shape, rhythm, and balance.",
  imageUrl: exampleUrl("form-study"),
  title: "Form study",
};
const signal = {
  body: "A poster series about finding patterns in noise.",
  imageUrl: exampleUrl("signal-cover"),
  title: "Signal cover",
};

const content = {
  about: {
    description: "I’m Alex, an independent designer working on public-interest projects.",
    items: [
      {
        body: "I start with interviews and test prototypes with the people who will use them.",
        title: "How I work",
      },
    ],
    title: "About my practice",
  },
  "about-hero": {
    description: "Independent designer and illustrator based in Barcelona.",
    options: { mediaUrl: form.imageUrl },
    title: "Meet Alex Morgan",
  },
  accordion: {
    description: "Expand an entry to see the decisions behind the work.",
    items: [
      { body: "We interviewed twelve readers about how they find reports.", title: "Research" },
      { body: "A clickable prototype let us compare two navigation patterns.", title: "Prototype" },
    ],
    title: "Project notes",
  },
  awards: {
    description: "Selected recognition for independent work.",
    items: [
      {
        body: "Recognized for the Atlas public research dashboard.",
        period: "2025",
        title: "Community Design Prize",
      },
    ],
    title: "Awards and recognition",
  },
  "blog-page": {
    description: "Longer notes on the work behind the scenes.",
    items: [
      {
        body: "What changed when I treated performance as a design constraint.",
        period: "May 2026",
        title: "Designing for a slower web",
      },
    ],
    title: "Studio journal",
  },
  "calendar-link": {
    description: "Choose a time for a 20-minute introductory call.",
    items: [
      {
        body: "Weekdays, 10:00–16:00 CET.",
        title: "View available times",
        url: "https://example.com/book",
      },
    ],
    title: "Book an introduction",
  },
  careers: {
    description: "Open roles at our fictional design studio.",
    items: [
      {
        body: "Help prototype and test tools for public libraries.",
        title: "Product designer",
        value: "Remote · Full time",
      },
      {
        body: "Help prepare workshop materials and archive studio work.",
        title: "Studio intern",
        value: "Barcelona · Part time",
      },
    ],
    title: "Work with us",
  },
  clients: {
    description: "Organizations represented by example work.",
    items: [atlas, orbit],
    title: "Selected clients",
  },
  "contact-form": {
    description: "Share a brief outline of what you’re working on.",
    options: { email: "hello@example.com" },
    title: "Tell me about your project",
  },
  "contact-info": {
    description: "Reach the studio on weekdays.",
    items: [
      { body: "hello@example.com", title: "Studio email" },
      { body: "Barcelona, Spain", title: "Location" },
    ],
    title: "Contact details",
  },
  cta: {
    description: "Tell me what you’d like to make.",
    items: [
      {
        body: "Include your timeline and what you need help with.",
        title: "Send a project brief",
        url: "https://example.com/contact",
      },
    ],
    options: { columns: 1 },
    title: "Have a project in mind?",
  },
  custom: {
    description: "A custom list of notes that don’t fit into the project archive.",
    items: [
      { body: "A collection of essays about signage in public spaces.", title: "What I’m reading" },
      { body: "A pocket-sized field guide printed in two inks.", title: "What I’m testing" },
    ],
    title: "From the studio notebook",
  },
  dashboard: {
    description: "Key figures from the latest archive release.",
    items: [
      {
        body: "Across all public collections.",
        period: "June 2026",
        title: "Reports indexed",
        value: "240",
      },
      {
        body: "Participating libraries across three cities.",
        period: "June 2026",
        title: "Library partners",
        value: "12",
      },
      {
        body: "New subjects with curated reading lists.",
        period: "June 2026",
        title: "Topics covered",
        value: "18",
      },
    ],
    title: "Atlas project dashboard",
  },
  faq: {
    description: "Details about booking and working together.",
    items: [
      {
        body: "A focused design sprint usually takes two weeks.",
        title: "How long does a project take?",
      },
      {
        body: "Yes. I run remote workshops and share progress asynchronously.",
        title: "Do you work remotely?",
      },
      {
        body: "A short brief and any deadlines you already know.",
        title: "What should I bring to the first call?",
      },
    ],
    title: "Frequently asked questions",
  },
  features: {
    description: "Three ways to find and share research.",
    items: [
      { body: "Narrow the archive by topic, year, and organization.", title: "Filter reports" },
      { body: "Group related reports into reading lists.", title: "Save collections" },
      { body: "Send collaborators a link that keeps your filters.", title: "Share a view" },
    ],
    title: "What Atlas can do",
  },
  "gallery-grid": {
    description: "Open an image for a closer look.",
    items: [atlas, orbit, form, signal],
    title: "Selected artwork",
  },
  heading: {
    description: "Research tools, identities, and editorial experiments.",
    options: { alignment: "center" },
    title: "Selected work, 2024–2026",
  },
  hero: {
    description: "Research-led design for libraries, cultural spaces, and civic organizations.",
    options: { alignment: "center", mediaUrl: atlas.imageUrl },
    title: "Design for public life",
  },
  "how-to": {
    description: "Three steps before the first workshop.",
    items: [
      { body: "Describe who will use the service and when.", title: "Name the audience" },
      { body: "Bring one example that works and one that falls short.", title: "Gather examples" },
      { body: "Pick something you can observe after launch.", title: "Write a success measure" },
    ],
    title: "How to prepare a design brief",
  },
  instagram: {
    description: "Selected posts from a work-in-progress series.",
    items: [{ ...form, url: "https://www.instagram.com/p/CX0Example/" }],
    title: "Sketchbook on Instagram",
  },
  "legal-text": {
    description: "Sample licensing terms for studio artwork.",
    items: [
      {
        body: "Contact the studio for written permission before reproducing or redistributing these illustrations.",
        title: "Permission",
      },
    ],
    title: "Image usage",
  },
  map: {
    description: "Meet near Plaça de Catalunya in central Barcelona.",
    options: { latitude: 41.3874, longitude: 2.1686 },
    title: "Visit the studio",
  },
  menu: {
    description: "A small menu for the studio’s open day.",
    items: [
      { body: "Rotating single-origin beans.", title: "Filter coffee", value: "€3" },
      { body: "A slice with lemon glaze.", title: "Lemon cake", value: "€4" },
    ],
    title: "Workshop café menu",
  },
  newsletter: {
    description: "Monthly notes on current projects and upcoming workshops.",
    options: { actionUrl: "https://example.com/newsletter" },
    title: "Studio dispatch",
  },
  pinterest: {
    description: "A selected reference from the illustration process.",
    items: [{ ...signal, url: "https://www.pinterest.com/pin/123456789012345678/" }],
    title: "Studio inspiration on Pinterest",
  },
  plans: {
    description: "Choose a format that fits the size of your team.",
    items: [
      {
        body: "A focused session for up to six people.",
        details: ["Briefing call", "Three-hour workshop", "Action notes"],
        title: "Half-day",
        value: "3 hours",
      },
      {
        body: "A facilitated workshop and written recap.",
        details: ["Briefing call", "Six-hour workshop", "Written recap"],
        title: "Full-day",
        value: "6 hours",
      },
    ],
    title: "Workshop plans",
  },
  "posts-grid": {
    description: "Short reads from the studio journal.",
    items: [
      { ...atlas, period: "June 2026", title: "Making an archive searchable" },
      { ...orbit, period: "April 2026", title: "Designing a festival identity" },
    ],
    title: "Recent articles",
  },
  pricing: {
    description: "Example rates for editorial commissions.",
    items: [
      {
        body: "One small illustration with two revision rounds.",
        details: ["One concept", "Two revisions", "Web-ready files"],
        title: "Spot illustration",
        url: "https://example.com/commissions/spot",
        value: "€250",
      },
      {
        body: "Full-page art with print and web files.",
        details: ["Two concepts", "Two revisions", "Print and web files"],
        title: "Cover illustration",
        url: "https://example.com/commissions/cover",
        value: "€750",
      },
    ],
    title: "Illustration pricing",
  },
  profile: {
    description: "About the person behind the portfolio.",
    items: [
      {
        body: "Independent designer specializing in research and editorial systems.",
        title: "Alex Morgan",
        value: "Barcelona, Spain",
      },
    ],
    options: { columns: 1 },
    title: "Designer profile",
  },
  projects: {
    description: "Recent work with cultural and civic organizations.",
    items: [atlas, orbit, signal],
    title: "Featured projects",
  },
  property: {
    description: "A fictional listing for a small creative studio.",
    items: [
      {
        ...form,
        body: "Daylight, a communal table, and room for eight participants.",
        title: "Shared studio, Eixample",
        value: "45 m²",
      },
    ],
    options: { columns: 1 },
    title: "Workshop space",
  },
  quickstart: {
    description: "Preview a project on your own machine.",
    items: [
      {
        body: "From the checkout, install the locked packages.",
        code: "pnpm install",
        title: "Install dependencies",
      },
      { body: "Start the local development server.", code: "pnpm dev", title: "Run the preview" },
    ],
    title: "Quickstart",
  },
  services: {
    description: "Independent support for teams working on public services.",
    items: [
      { body: "Interviews, synthesis, and usability tests.", title: "Design research" },
      { body: "Illustrated reports, guides, and publication systems.", title: "Editorial design" },
    ],
    title: "Design services",
  },
  "shop-items": {
    description: "A small selection of printed work.",
    items: [
      { ...signal, title: "Signal poster", value: "€22" },
      { ...form, title: "Form study postcard", value: "€5" },
    ],
    title: "Studio shop",
  },
  showcase: {
    description: "A look at two visual systems in use.",
    items: [orbit, signal],
    title: "Identity showcase",
  },
  "social-links": {
    description: "Follow new work and studio updates.",
    items: [
      {
        body: "Case studies and selected commissions.",
        title: "Portfolio",
        url: "https://example.com/portfolio",
      },
      {
        body: "Notes on the design process.",
        title: "Journal",
        url: "https://example.com/journal",
      },
    ],
    title: "Find me online",
  },
  stats: {
    description: "Illustrative metrics for the research archive.",
    items: [
      { body: "Across all collections.", title: "Reports indexed", value: "240" },
      { body: "Across three cities.", title: "Contributing libraries", value: "12" },
      { body: "From education to transport.", title: "Topics", value: "18" },
    ],
    title: "Atlas in numbers",
  },
  studies: {
    description: "Formal training and continuing study.",
    items: [
      {
        body: "Studied design research and prototyping.",
        period: "2020–2022",
        title: "MA in Interaction Design",
      },
      {
        body: "Focused on typography and editorial design.",
        period: "2016–2020",
        title: "BA in Graphic Design",
      },
    ],
    title: "Education",
  },
  "table-of-contents": {
    description: "Jump to a section of the portfolio.",
    title: "On this page",
  },
  tabs: {
    description: "Switch between the brief, process, and outcome.",
    items: [
      { body: "Make public research easier to find.", title: "Brief" },
      { body: "Test filter patterns with librarians.", title: "Process" },
      { body: "Publish a searchable catalog with shared reading lists.", title: "Outcome" },
    ],
    title: "Project overview",
  },
  team: {
    description: "The people behind the Atlas project.",
    items: [
      { body: "Design and prototyping.", title: "Alex Morgan", value: "Design lead" },
      { body: "Interviews and usability testing.", title: "Sam Rivera", value: "Research lead" },
    ],
    title: "Meet the team",
  },
  "technical-skills": {
    description: "The methods and technologies I use in projects.",
    items: [
      { body: "Typed prototypes and interactive examples.", title: "TypeScript" },
      { body: "Keyboard and screen reader checks.", title: "Accessibility" },
      { body: "Charts for editorial and research projects.", title: "Data visualization" },
    ],
    title: "Tools and skills",
  },
  testimonials: {
    description: "Fictional quotes for the testimonial layout.",
    items: [
      {
        body: "Alex made a complicated archive feel approachable.",
        title: "Sam Rivera",
        value: "Research lead",
      },
      {
        body: "The new identity gave our festival a recognizable presence.",
        title: "Jamie Chen",
        value: "Festival director",
      },
    ],
    title: "What collaborators say",
  },
  text: {
    description: "An example of long-form text in a portfolio.",
    items: [
      {
        body: "I start by observing how people use the existing service.\n\nTheir workarounds often tell me where a redesign can help.",
        title: "First steps",
      },
    ],
    title: "A note on process",
  },
  timeline: {
    description: "The Atlas archive from kickoff to launch.",
    items: [
      {
        body: "Interviewed researchers and librarians.",
        period: "January 2026",
        title: "Discovery",
      },
      {
        body: "Tested search and filters with participants.",
        period: "March 2026",
        title: "Prototype",
      },
      { body: "Published the first collection of reports.", period: "June 2026", title: "Launch" },
    ],
    title: "Project milestones",
  },
  video: {
    description: "A video preview with playback controls.",
    items: [
      {
        ...signal,
        title: "Sample reel",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    ],
    options: { columns: 1 },
    title: "Studio motion reel",
  },
  "work-experience": {
    description: "Recent roles in design and research.",
    items: [
      {
        body: "Led the redesign of a public research archive.",
        period: "2024–Present",
        title: "Design lead · Atlas Lab",
      },
      {
        body: "Prototyped tools for local library teams.",
        period: "2021–2024",
        title: "Product designer · Civic Works",
      },
    ],
    title: "Work experience",
  },
  youtube: {
    description: "The player loads after the viewer chooses to connect to YouTube.",
    items: [{ ...form, title: "Example film", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }],
    options: { columns: 1 },
    title: "Selected video",
  },
} satisfies Record<AuthorableSectionType, StoryContent>;

export function sectionStory(
  type: AuthorableSectionType,
  state: "default" | "compact" | "empty" = "default",
): SectionProps {
  const sample: StoryContent = content[type];
  const empty = state === "empty";
  const section: CustomSection = {
    id: `custom-story-${type}`,
    items: empty
      ? []
      : (sample.items ?? []).map((item, index) => ({
          url: "",
          ...item,
          id: `${type}-${index + 1}`,
        })),
    options: empty
      ? {}
      : {
          columns: 3,
          description: sample.description,
          ...sample.options,
          ...(state === "compact" && { columns: 1 }),
        },
    renderer: getSectionRenderers(type)[0],
    sectionType: type,
    title: empty ? authorableSections[type].name : sample.title,
    visible: true,
  };
  return {
    anchors:
      !empty && type === "table-of-contents"
        ? [
            { id: "introduction", title: "Introduction" },
            { id: "work", title: "Selected work" },
          ]
        : [],
    preview: true,
    section,
  };
}

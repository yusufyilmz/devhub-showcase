import type { Language, PortfolioProfile, PortfolioTheme, PortfolioType } from "@shared/content";

type Seed = {
  slug: string;
  name: string;
  title: string;
  category: string;
  type: PortfolioType;
  theme: PortfolioTheme;
  summary: string;
  focus: string;
  company: string;
  skills: string[];
  projects: [string, string, string, string];
  language?: Language;
  covers?: [string, string];
};
export type PortfolioExample = {
  slug: string;
  category: string;
  profile: PortfolioProfile;
  covers: Record<string, string>;
};
function sampleCvLayout(type: PortfolioType) {
  if (type === "designer") return "editorial";
  return type === "minimal" ? "compact" : "classic";
}
function example(seed: Seed): PortfolioExample {
  const language = seed.language ?? "en";
  const defaultTheme = ["paper", "bloom"].includes(seed.theme) ? "light" : "dark";
  return {
    category: seed.category,
    covers: seed.covers ? { first: seed.covers[0], second: seed.covers[1] } : {},
    profile: {
      about: [seed.summary, seed.focus],
      appearance: {
        accent: seed.type === "designer" ? "violet" : "emerald",
        defaultTheme: defaultTheme,
        theme: seed.theme,
      },
      cvLanguage: language,
      cvLayout: sampleCvLayout(seed.type),
      cvUrl: "/cv.pdf",
      education: [],
      email: `${seed.slug}@example.com`,
      experiences: [
        {
          achievements: [seed.focus, seed.projects[1]],
          company: seed.company,
          companyUrl: "https://example.com",
          end: null,
          id: "current",
          position: seed.title,
          start: "2023-01-01",
        },
      ],
      github: "",
      languages: [
        {
          id: "primary",
          language: language === "es" ? "Español" : language === "tr" ? "Türkçe" : "English",
          proficiency: language === "es" ? "Fluido" : language === "tr" ? "Ana dil" : "Fluent",
        },
      ],
      linkedin: "",
      location: "Barcelona, Spain",
      name: seed.name,
      phone: "",
      portfolioLanguage: language,
      portfolioType: seed.type,
      projects: [
        {
          company: seed.company,
          description: seed.projects[1],
          experienceId: "current",
          id: "first",
          name: seed.projects[0],
          public: true,
          skills: seed.skills.slice(0, 3),
          sourceUrl: null,
          url: null,
        },
        {
          company: "Independent",
          description: seed.projects[3],
          experienceId: null,
          id: "second",
          name: seed.projects[2],
          public: true,
          skills: seed.skills.slice(1, 4),
          sourceUrl: null,
          url: null,
        },
      ],
      skills: {
        [language === "es" ? "Especialidades" : language === "tr" ? "Uzmanlık" : "Expertise"]:
          seed.skills,
      },
      summary: seed.summary,
      templateChosen: true,
      title: seed.title,
      website: "",
    },
    slug: seed.slug,
  };
}
export const portfolioExamples: PortfolioExample[] = [
  example({
    category: "Tools that help teams build",
    company: "Northstar Works",
    focus: "My work connects API design, observability and thoughtful developer experience.",
    name: "Avery Morgan",
    projects: [
      "Beacon developer portal",
      "A fictional internal portal that brings service ownership, API guides and deployment status into one place.",
      "Transit API",
      "A sample event API with clear contracts, reliable retries and a small dashboard for understanding failures.",
    ],
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Observability"],
    slug: "avery-morgan",
    summary:
      "I turn complex infrastructure into calm, reliable tools for the people building on it.",
    theme: "studio",
    title: "Platform engineer",
    type: "engineer",
  }),
  example({
    category: "Thoughtful digital experiences",
    company: "Form Practice",
    covers: ["form-study.svg", "atlas-interface.svg"],
    focus:
      "From early sketches to accessible interfaces, I connect research with a clear visual system.",
    name: "Maya Chen",
    projects: [
      "Form: a calmer workspace",
      "A fictional product concept exploring how focused writing and gentle navigation can make a workspace feel simpler.",
      "Atlas wayfinding",
      "A sample mobile interface that helps visitors explore a place through clear routes and accessible information.",
    ],
    skills: ["Product design", "Research", "Prototyping", "Design systems"],
    slug: "maya-chen",
    summary:
      "I shape digital products around the way people actually think, explore and make decisions.",
    theme: "paper",
    title: "Product & interaction designer",
    type: "designer",
  }),
  example({
    category: "Clear direction for ambitious teams",
    company: "Fieldwork Advisory",
    focus:
      "My approach combines discovery, shared decision making and small experiments that make progress visible.",
    name: "Alex Rivera",
    projects: [
      "A shared product direction",
      "A fictional strategy engagement aligning a small team around customer problems and a practical product roadmap.",
      "Discovery toolkit",
      "A sample collection of workshop formats, research prompts and decision records for early product teams.",
    ],
    skills: ["Product strategy", "Facilitation", "Discovery", "Roadmaps"],
    slug: "alex-rivera",
    summary:
      "I help teams turn an ambitious idea into a focused roadmap and a practical next step.",
    theme: "graphite",
    title: "Product strategy consultant",
    type: "consultant",
  }),
  example({
    category: "Ideas with room to breathe",
    company: "Margin Notes",
    focus:
      "My process starts with careful listening, thoughtful research and an edit that makes the idea clearer.",
    name: "Jamie Reed",
    projects: [
      "The shape of a working day",
      "A fictional essay series about attention, everyday tools and the small habits that shape creative work.",
      "A field guide to listening",
      "A sample editorial guide for planning interviews, asking useful questions and making space for different perspectives.",
    ],
    skills: ["Writing", "Editing", "Interviews", "Research"],
    slug: "jamie-reed",
    summary: "I write about the everyday places where technology, culture and human choices meet.",
    theme: "paper",
    title: "Writer & editorial researcher",
    type: "minimal",
  }),
  example({
    category: "Accessible interfaces, in Turkish",
    company: "Kuzey Atölye",
    focus:
      "Tasarım ve mühendislik arasında ortak bir dil kurarak tutarlı kullanıcı deneyimleri geliştiriyorum.",
    language: "tr",
    name: "Samir Kaya",
    projects: [
      "Bileşen kütüphanesi",
      "Kurgusal bir ürün ekibi için erişilebilir bileşenler, kullanım örnekleri ve tasarım ilkeleri.",
      "Kent rehberi",
      "Bir şehri keşfetmeyi kolaylaştıran, mobil kullanıma uygun örnek bir arayüz çalışması.",
    ],
    skills: ["React", "TypeScript", "Erişilebilirlik", "Tasarım sistemleri"],
    slug: "samir-kaya",
    summary: "Karmaşık ürünleri anlaşılır, erişilebilir ve bakımı kolay arayüzlere dönüştürüyorum.",
    theme: "graphite",
    title: "Frontend mühendisi",
    type: "engineer",
  }),
  example({
    category: "Identity with a playful edge",
    company: "Little Orbit Studio",
    covers: ["orbit-brand.svg", "signal-cover.svg"],
    focus:
      "My practice moves between typography, color, digital experiences and the details that hold an identity together.",
    name: "Luna Ortiz",
    projects: [
      "Orbit: an independent identity",
      "A fictional visual identity for a creative studio, built around playful shapes and a confident typographic voice.",
      "Signal editorial",
      "A sample publication concept exploring rhythm, contrast and a flexible system for digital stories.",
    ],
    skills: ["Brand identity", "Art direction", "Typography", "Digital design"],
    slug: "luna-ortiz",
    summary:
      "I build expressive identities that connect a clear idea with a memorable visual world.",
    theme: "bloom",
    title: "Visual designer & art director",
    type: "designer",
  }),
  example({
    category: "Making good ideas work in practice",
    company: "Common Ground Partners",
    focus:
      "I bring people together around useful processes, shared responsibilities and practical delivery habits.",
    name: "Deniz Arslan",
    projects: [
      "A clearer delivery rhythm",
      "A fictional operating model for a distributed team, with clear priorities and lightweight decision records.",
      "Better handoffs",
      "A sample service blueprint that makes dependencies, ownership and communication easier to understand.",
    ],
    skills: ["Operations", "Delivery", "Process design", "Team facilitation"],
    slug: "deniz-arslan",
    summary:
      "I help growing teams make their work clearer, their handoffs smoother and their next decision easier.",
    theme: "studio",
    title: "Operations & delivery consultant",
    type: "consultant",
  }),
  example({
    category: "Research and writing, in Spanish",
    company: "Estudio Trama",
    focus:
      "Conecto entrevistas, lectura crítica y escritura clara para acercar ideas complejas a nuevos públicos.",
    language: "es",
    name: "Sofía Marín",
    projects: [
      "Aprender en comunidad",
      "Un estudio ficticio sobre los espacios y las conversaciones que facilitan el aprendizaje compartido.",
      "Cuadernos de campo",
      "Una colección de ejemplo que transforma notas de investigación en historias accesibles y bien contextualizadas.",
    ],
    skills: ["Investigación", "Entrevistas", "Divulgación", "Escritura"],
    slug: "sofia-marin",
    summary:
      "Investigo cómo las personas aprenden, colaboran y dan sentido a los cambios que las rodean.",
    theme: "bloom",
    title: "Investigadora y divulgadora",
    type: "minimal",
  }),
];
export const examplePath = (slug: string) => `/p/examples/${slug}`;
export const getPortfolioExample = (slug: string) =>
  portfolioExamples.find((item) => item.slug === slug);
export function getExampleForPath(path: string) {
  const slug = path.match(/^\/p\/examples\/([a-z0-9-]+)\/?$/)?.[1];
  return slug ? getPortfolioExample(slug) : undefined;
}
export function exampleViewProfile(item: PortfolioExample): PortfolioProfile {
  return {
    ...item.profile,
    cvUrl: `${examplePath(item.slug)}/cv.pdf`,
    projects: item.profile.projects.map((project) => ({
      ...project,
      coverImage: item.covers[project.id] ? `/examples/${item.covers[project.id]}` : null,
    })),
  };
}

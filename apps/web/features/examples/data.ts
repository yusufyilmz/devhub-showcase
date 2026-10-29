import type {
  Language,
  PortfolioProfile,
  PortfolioTheme,
  PortfolioType
} from '@shared/content'

type Seed = {
  slug: string
  name: string
  title: string
  category: string
  type: PortfolioType
  theme: PortfolioTheme
  summary: string
  focus: string
  company: string
  skills: string[]
  projects: [string, string, string, string]
  language?: Language
  covers?: [string, string]
}
export type PortfolioExample = {
  slug: string
  category: string
  profile: PortfolioProfile
  covers: Record<string, string>
}
function sampleCvLayout(type: PortfolioType) {
  if (type === 'designer') return 'editorial'
  return type === 'minimal' ? 'compact' : 'classic'
}
function example(seed: Seed): PortfolioExample {
  const language = seed.language ?? 'en'
  const defaultTheme = ['paper', 'bloom'].includes(seed.theme)
    ? 'light'
    : 'dark'
  return {
    slug: seed.slug,
    category: seed.category,
    covers: seed.covers
      ? { first: seed.covers[0], second: seed.covers[1] }
      : {},
    profile: {
      name: seed.name,
      title: seed.title,
      location: 'Barcelona, Spain',
      email: `${seed.slug}@example.com`,
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      summary: seed.summary,
      about: [seed.summary, seed.focus],
      portfolioType: seed.type,
      templateChosen: true,
      portfolioLanguage: language,
      cvLanguage: language,
      appearance: {
        theme: seed.theme,
        accent: seed.type === 'designer' ? 'violet' : 'emerald',
        defaultTheme: defaultTheme
      },
      cvLayout: sampleCvLayout(seed.type),
      cvUrl: '/cv.pdf',
      experiences: [
        {
          id: 'current',
          company: seed.company,
          companyUrl: 'https://example.com',
          position: seed.title,
          start: '2023-01-01',
          end: null,
          achievements: [seed.focus, seed.projects[1]]
        }
      ],
      projects: [
        {
          id: 'first',
          name: seed.projects[0],
          company: seed.company,
          experienceId: 'current',
          description: seed.projects[1],
          skills: seed.skills.slice(0, 3),
          public: true,
          url: null,
          sourceUrl: null
        },
        {
          id: 'second',
          name: seed.projects[2],
          company: 'Independent',
          experienceId: null,
          description: seed.projects[3],
          skills: seed.skills.slice(1, 4),
          public: true,
          url: null,
          sourceUrl: null
        }
      ],
      education: [],
      skills: {
        [language === 'es'
          ? 'Especialidades'
          : language === 'tr'
            ? 'Uzmanlık'
            : 'Expertise']: seed.skills
      },
      languages: [
        {
          id: 'primary',
          language:
            language === 'es'
              ? 'Español'
              : language === 'tr'
                ? 'Türkçe'
                : 'English',
          proficiency:
            language === 'es'
              ? 'Fluido'
              : language === 'tr'
                ? 'Ana dil'
                : 'Fluent'
        }
      ]
    }
  }
}
export const portfolioExamples: PortfolioExample[] = [
  example({
    slug: 'avery-morgan',
    name: 'Avery Morgan',
    title: 'Platform engineer',
    category: 'Tools that help teams build',
    type: 'engineer',
    theme: 'studio',
    summary:
      'I turn complex infrastructure into calm, reliable tools for the people building on it.',
    focus:
      'My work connects API design, observability and thoughtful developer experience.',
    company: 'Northstar Works',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Observability'],
    projects: [
      'Beacon developer portal',
      'A fictional internal portal that brings service ownership, API guides and deployment status into one place.',
      'Transit API',
      'A sample event API with clear contracts, reliable retries and a small dashboard for understanding failures.'
    ]
  }),
  example({
    slug: 'maya-chen',
    name: 'Maya Chen',
    title: 'Product & interaction designer',
    category: 'Thoughtful digital experiences',
    type: 'designer',
    theme: 'paper',
    summary:
      'I shape digital products around the way people actually think, explore and make decisions.',
    focus:
      'From early sketches to accessible interfaces, I connect research with a clear visual system.',
    company: 'Form Practice',
    skills: ['Product design', 'Research', 'Prototyping', 'Design systems'],
    covers: ['form-study.svg', 'atlas-interface.svg'],
    projects: [
      'Form: a calmer workspace',
      'A fictional product concept exploring how focused writing and gentle navigation can make a workspace feel simpler.',
      'Atlas wayfinding',
      'A sample mobile interface that helps visitors explore a place through clear routes and accessible information.'
    ]
  }),
  example({
    slug: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Product strategy consultant',
    category: 'Clear direction for ambitious teams',
    type: 'consultant',
    theme: 'graphite',
    summary:
      'I help teams turn an ambitious idea into a focused roadmap and a practical next step.',
    focus:
      'My approach combines discovery, shared decision making and small experiments that make progress visible.',
    company: 'Fieldwork Advisory',
    skills: ['Product strategy', 'Facilitation', 'Discovery', 'Roadmaps'],
    projects: [
      'A shared product direction',
      'A fictional strategy engagement aligning a small team around customer problems and a practical product roadmap.',
      'Discovery toolkit',
      'A sample collection of workshop formats, research prompts and decision records for early product teams.'
    ]
  }),
  example({
    slug: 'jamie-reed',
    name: 'Jamie Reed',
    title: 'Writer & editorial researcher',
    category: 'Ideas with room to breathe',
    type: 'minimal',
    theme: 'paper',
    summary:
      'I write about the everyday places where technology, culture and human choices meet.',
    focus:
      'My process starts with careful listening, thoughtful research and an edit that makes the idea clearer.',
    company: 'Margin Notes',
    skills: ['Writing', 'Editing', 'Interviews', 'Research'],
    projects: [
      'The shape of a working day',
      'A fictional essay series about attention, everyday tools and the small habits that shape creative work.',
      'A field guide to listening',
      'A sample editorial guide for planning interviews, asking useful questions and making space for different perspectives.'
    ]
  }),
  example({
    slug: 'samir-kaya',
    name: 'Samir Kaya',
    title: 'Frontend mühendisi',
    category: 'Accessible interfaces, in Turkish',
    type: 'engineer',
    theme: 'graphite',
    language: 'tr',
    summary:
      'Karmaşık ürünleri anlaşılır, erişilebilir ve bakımı kolay arayüzlere dönüştürüyorum.',
    focus:
      'Tasarım ve mühendislik arasında ortak bir dil kurarak tutarlı kullanıcı deneyimleri geliştiriyorum.',
    company: 'Kuzey Atölye',
    skills: ['React', 'TypeScript', 'Erişilebilirlik', 'Tasarım sistemleri'],
    projects: [
      'Bileşen kütüphanesi',
      'Kurgusal bir ürün ekibi için erişilebilir bileşenler, kullanım örnekleri ve tasarım ilkeleri.',
      'Kent rehberi',
      'Bir şehri keşfetmeyi kolaylaştıran, mobil kullanıma uygun örnek bir arayüz çalışması.'
    ]
  }),
  example({
    slug: 'luna-ortiz',
    name: 'Luna Ortiz',
    title: 'Visual designer & art director',
    category: 'Identity with a playful edge',
    type: 'designer',
    theme: 'bloom',
    summary:
      'I build expressive identities that connect a clear idea with a memorable visual world.',
    focus:
      'My practice moves between typography, color, digital experiences and the details that hold an identity together.',
    company: 'Little Orbit Studio',
    skills: ['Brand identity', 'Art direction', 'Typography', 'Digital design'],
    covers: ['orbit-brand.svg', 'signal-cover.svg'],
    projects: [
      'Orbit: an independent identity',
      'A fictional visual identity for a creative studio, built around playful shapes and a confident typographic voice.',
      'Signal editorial',
      'A sample publication concept exploring rhythm, contrast and a flexible system for digital stories.'
    ]
  }),
  example({
    slug: 'deniz-arslan',
    name: 'Deniz Arslan',
    title: 'Operations & delivery consultant',
    category: 'Making good ideas work in practice',
    type: 'consultant',
    theme: 'studio',
    summary:
      'I help growing teams make their work clearer, their handoffs smoother and their next decision easier.',
    focus:
      'I bring people together around useful processes, shared responsibilities and practical delivery habits.',
    company: 'Common Ground Partners',
    skills: ['Operations', 'Delivery', 'Process design', 'Team facilitation'],
    projects: [
      'A clearer delivery rhythm',
      'A fictional operating model for a distributed team, with clear priorities and lightweight decision records.',
      'Better handoffs',
      'A sample service blueprint that makes dependencies, ownership and communication easier to understand.'
    ]
  }),
  example({
    slug: 'sofia-marin',
    name: 'Sofía Marín',
    title: 'Investigadora y divulgadora',
    category: 'Research and writing, in Spanish',
    type: 'minimal',
    theme: 'bloom',
    language: 'es',
    summary:
      'Investigo cómo las personas aprenden, colaboran y dan sentido a los cambios que las rodean.',
    focus:
      'Conecto entrevistas, lectura crítica y escritura clara para acercar ideas complejas a nuevos públicos.',
    company: 'Estudio Trama',
    skills: ['Investigación', 'Entrevistas', 'Divulgación', 'Escritura'],
    projects: [
      'Aprender en comunidad',
      'Un estudio ficticio sobre los espacios y las conversaciones que facilitan el aprendizaje compartido.',
      'Cuadernos de campo',
      'Una colección de ejemplo que transforma notas de investigación en historias accesibles y bien contextualizadas.'
    ]
  })
]
export const examplePath = (slug: string) => `/p/examples/${slug}`
export const getPortfolioExample = (slug: string) =>
  portfolioExamples.find((item) => item.slug === slug)
export function getExampleForPath(path: string) {
  const slug = path.match(/^\/p\/examples\/([a-z0-9-]+)\/?$/)?.[1]
  return slug ? getPortfolioExample(slug) : undefined
}
export function exampleViewProfile(item: PortfolioExample): PortfolioProfile {
  return {
    ...item.profile,
    cvUrl: `${examplePath(item.slug)}/cv.pdf`,
    projects: item.profile.projects.map((project) => ({
      ...project,
      coverImage: item.covers[project.id]
        ? `/examples/${item.covers[project.id]}`
        : null
    }))
  }
}

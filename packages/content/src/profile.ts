import type { CustomSection, PortfolioEntryId } from './custom-sections'
import type { Language } from './languages'
import type { PortfolioSectionId } from './portfolio-sections'
import type { CvLayout, PortfolioType } from './portfolio-types'
import type { PortfolioSectionSettings } from './section-registry'
import type { PortfolioTheme } from './themes'

/** Verified public career content, updated from the October 2026 CV. */
export interface ProfileExperience {
  id: string
  company: string
  companyUrl: string
  position: string
  start: string
  end: string | null
  achievements: string[]
}
export interface ProfileProject {
  id: string
  name: string
  company: string
  experienceId: string | null
  url: string | null
  sourceUrl: string | null
  description: string
  skills: string[]
  public: boolean
  coverImage?: string | null
}
export interface PortfolioProfile {
  hero?: {
    kind: 'image' | 'video'
    url: string
    poster?: string
    position: 'center' | 'top' | 'bottom'
    overlay: 'soft' | 'strong'
  }
  sectionOrder?: PortfolioSectionId[]
  customSections?: CustomSection[]
  sectionSequence?: PortfolioEntryId[]
  sectionSettings?: PortfolioSectionSettings
  portfolioLanguage?: Language
  cvLanguage?: Language
  portfolioType?: PortfolioType
  templateChosen?: boolean
  cvLayout?: CvLayout
  cvSettings?: {
    pageSize: 'A4' | 'LETTER'
    fontSize: 9 | 10 | 11
    showEmail: boolean
    showPhone: boolean
    includeProjects: boolean
    includeLanguages: boolean
  }

  cvUrl?: string
  appearance?: {
    theme?: PortfolioTheme
    accent: 'cyan' | 'violet' | 'emerald'
    defaultTheme: 'system' | 'light' | 'dark'
  }

  name: string
  title: string
  location: string
  email: string
  phone: string
  website: string
  github: string
  linkedin: string
  summary: string
  about: string[]
  experiences: ProfileExperience[]
  projects: ProfileProject[]
  education: {
    id: string
    degree: string
    field: string
    institution: string
    url: string
    start: string
    end: string
  }[]
  skills: Record<string, string[]>
  languages: { id: string; language: string; proficiency: string }[]
}
export const profile: PortfolioProfile = {
  name: 'Yusuf Yilmaz',
  title: 'Senior Frontend / Full-Stack Software Engineer',
  location: 'Barcelona, Spain',
  email: 'yilmazyu@gmail.com',
  phone: '+34 639 464 069',
  website: 'https://yusufdevhub.vercel.app',
  github: 'https://github.com/yusufyilmz',
  linkedin: 'https://www.linkedin.com/in/yusuf-yilmaz-01543752/',
  summary:
    'Software engineer with 13+ years of experience, specializing in React, Next.js, TypeScript and frontend platform architecture, with full-stack delivery across Node.js, APIs and cloud infrastructure. I modernize complex applications, build reusable engineering platforms and deliver business-critical products in fintech, SaaS, gaming and telecommunications.',
  about: [
    'I am a frontend-focused full-stack engineer based in Barcelona. Since 2012, I have worked across fintech, SaaS, gaming and telecommunications, combining React, Next.js and TypeScript with APIs, data and cloud infrastructure.',
    'At dLocal, I work on Finance Core Frontend, Treasury Movements and commercial finance tools. My work includes reusable platform components, bank-account and entity management, spreadsheet-driven workflows, a Bank Movements Classifier with business rules and AI-assisted suggestions, and notification integrations.',
    'Previously at Toptal, I built Google Ads automation tools and an AI-assisted Assets Generator, modernized approximately ten legacy web tools, and developed Slack messaging and SEM data-processing services. Earlier roles included mobile-test automation at Scopely, publisher tools at Marfeel, and customer-service platforms supporting more than 600,000 daily interactions at Turkcell.',
    'I also build personal projects, including this portfolio and Yusuf Fitness OS: a mobile-first app for workouts, meals, daily tasks, calendar scheduling and reminders. My focus is maintainable software, clear interfaces and end-to-end product delivery.'
  ],
  experiences: [
    {
      id: 'dlocal',
      company: 'dLocal',
      companyUrl: 'https://dlocal.com',
      position: 'Software Engineer III (Frontend-focused Full Stack)',
      start: '2024-12-01',
      end: null,
      achievements: [
        'Led frontend delivery across Finance Core Frontend, Treasury Movements and commercial finance tools, translating Finance and Operations requirements into maintainable workflows.',
        'Modernized the shared FCF monorepo with Turborepo, pnpm, TypeScript strict mode, MUI and tsdown. Standardized build configuration, reusable components, shared hooks and utilities.',
        'Built Treasury Movements experiences for bank-account master data, entity management, Brazil trading and cross-border flows, including spreadsheet-driven templates and counterparty workflows.',
        'Designed and delivered the Bank Movements Classifier with configurable business rules, AI-assisted suggestions, reprocessing, execution monitoring, transaction details and auditable classification decisions.',
        'Developed threaded Slack notification flows and foundations for the FCF Notifications API. Improved quality through Storybook, Chromatic, CI checks and OpenAPI, Swagger and Postman documentation.',
        'Built and improved CPQ payment tiers, fee configuration, pricing proposals, quote-sharing and Tradebook workflows.'
      ]
    },
    {
      id: 'toptal',
      company: 'Toptal',
      companyUrl: 'https://www.toptal.com',
      position: 'Senior Full-Stack Engineer',
      start: '2021-10-01',
      end: '2024-10-01',
      achievements: [
        'Created an AI-assisted Assets Generator using Next.js, Dify and background processing to turn interviews into editable customer success stories with review, refinement and publishing workflows.',
        'Engineered eight Google Ads automation tools for keyword generation, asset reviews and dynamic content management, from solution design through testing and deployment.',
        'Migrated approximately ten legacy web tools to Next.js. Built a centralized Slack messaging service and an ETL composer for Google Ads and BigQuery monitoring and alerts.'
      ]
    },
    {
      id: 'scopely',
      company: 'Scopely',
      companyUrl: 'https://www.scopely.com',
      position: 'Senior Software Engineer',
      start: '2020-10-01',
      end: '2021-09-01',
      achievements: [
        'Developed frontend and backend functionality for a platform enabling game engineers to launch mobile-device tests on AWS Device Farm and inspect results and reports.',
        'Supported a transition to micro-frontend architecture and Unity-related tooling.'
      ]
    },
    {
      id: 'marfeel',
      company: 'Marfeel',
      companyUrl: 'https://www.marfeel.com',
      position: 'Senior Full-Stack Developer',
      start: '2019-10-01',
      end: '2020-09-01',
      achievements: [
        'Modernized publisher-facing web products with React and server-side rendering.',
        'Built CLI tools and generated component playgrounds to streamline integration and testing for media-provider teams.'
      ]
    },
    {
      id: 'turkcell',
      company: 'Turkcell Global Bilgi',
      companyUrl: 'https://www.globalbilgi.com.tr',
      position: 'Senior Software Engineer',
      start: '2015-04-01',
      end: '2019-10-01',
      achievements: [
        'Built and led development of WebChat, Chat Gateway and integration services supporting more than 600,000 daily interactions. Designed a multichannel gateway integrating 20+ client systems.',
        'Implemented chat configuration, transaction management and integration services with infrastructure teams.',
        'Migrated WebChat to React and Redux in a compressed delivery window. Worked across JavaScript, Node.js, C#/.NET and real-time systems while mentoring junior engineers.'
      ]
    },
    {
      id: 'sestek',
      company: 'SESTEK',
      companyUrl: 'https://www.sestek.com',
      position: 'Software Engineer',
      start: '2012-11-01',
      end: '2015-04-01',
      achievements: [
        'Worked on speech-engine integrations, backend APIs and cross-platform application delivery.',
        'Developed text-to-speech and speech-recognition components, C++/C# web services and mobile clients using Swift and Objective-C.'
      ]
    }
  ],
  projects: [
    {
      id: 'fitness-os',
      name: 'Yusuf Fitness OS',
      company: 'Personal',
      experienceId: null,
      url: 'https://yusuf-fitness-os.vercel.app',
      sourceUrl: 'https://github.com/yusufyilmz/yusuf-fitness-os',
      description:
        'A mobile-first planning app for workouts, meals and daily tasks, with calendar scheduling, task completion, exercise details and reminders. Includes automated testing and deployment workflows.',
      skills: [
        'Next.js',
        'React',
        'TypeScript',
        'Supabase',
        'Vitest',
        'GitHub Actions'
      ],
      public: true
    },
    {
      id: 'devhub',
      name: 'DevHub Showcase',
      company: 'Personal',
      experienceId: null,
      url: 'https://yusufdevhub.vercel.app',
      sourceUrl: 'https://github.com/yusufyilmz/devhub-showcase',
      description:
        'A developer portfolio featuring project case studies, a downloadable CV and interactive AI chat. Built with a modular Next.js and TypeScript monorepo.',
      skills: [
        'Next.js',
        'React',
        'TypeScript',
        'Prisma',
        'PostgreSQL',
        'MUI',
        'Tailwind CSS'
      ],
      public: true
    },
    {
      id: 'bank-movements-classifier',
      name: 'Bank Movements Classifier',
      company: 'dLocal',
      experienceId: 'dlocal',
      url: null,
      sourceUrl: null,
      description:
        'Configurable classification rules and AI-assisted suggestions, with reprocessing, execution monitoring, transaction details and an audit trail.',
      skills: ['React', 'TypeScript', 'REST APIs'],
      public: false
    },
    {
      id: 'treasury',
      name: 'Treasury Movements & FCF Platform',
      company: 'dLocal',
      experienceId: 'dlocal',
      url: null,
      sourceUrl: null,
      description:
        'Reusable frontend platform components and Treasury workflows for entities, bank accounts, Brazil trading, spreadsheet templates and counterparties.',
      skills: ['React', 'TypeScript', 'MUI', 'Turborepo', 'pnpm', 'Storybook'],
      public: false
    },
    {
      id: 'cpq',
      name: 'CPQ & Tradebook',
      company: 'dLocal',
      experienceId: 'dlocal',
      url: null,
      sourceUrl: null,
      description:
        'Payment tiers, fee configuration, pricing proposals, quote-sharing and commercial finance workflows.',
      skills: ['React', 'TypeScript'],
      public: false
    },
    {
      id: 'assets-generator',
      name: 'TAG / Assets Generator',
      company: 'Toptal',
      experienceId: 'toptal',
      url: null,
      sourceUrl: null,
      description:
        'AI-assisted interview and success-story generation with review, refinement and publishing workflows.',
      skills: ['Next.js', 'React', 'TypeScript', 'Dify', 'Prisma'],
      public: false
    },
    {
      id: 'ads-automation',
      name: 'Google Ads Automation Tools',
      company: 'Toptal',
      experienceId: 'toptal',
      url: null,
      sourceUrl: null,
      description:
        'Eight tools for keyword generation, asset reviews and dynamic content management, with centralized Slack notifications and BigQuery monitoring.',
      skills: [
        'Next.js',
        'TypeScript',
        'Google Ads API',
        'BigQuery',
        'Node.js'
      ],
      public: false
    },
    {
      id: 'device-testing',
      name: 'Mobile Test Automation',
      company: 'Scopely',
      experienceId: 'scopely',
      url: null,
      sourceUrl: null,
      description:
        'A web platform for launching mobile-device tests on AWS Device Farm and reviewing results and reports.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      public: false
    },
    {
      id: 'publisher-tools',
      name: 'Publisher Tools & SSR',
      company: 'Marfeel',
      experienceId: 'marfeel',
      url: null,
      sourceUrl: null,
      description:
        'React publisher products, server-side rendering, CLI tools and component playgrounds.',
      skills: ['React', 'Node.js', 'TypeScript', 'SSR'],
      public: false
    },
    {
      id: 'webchat',
      name: 'WebChat & Chat Gateway',
      company: 'Turkcell Global Bilgi',
      experienceId: 'turkcell',
      url: null,
      sourceUrl: null,
      description:
        'High-volume customer-service systems supporting 600,000+ daily interactions and a gateway integrating 20+ client systems.',
      skills: ['React', 'Redux', 'Node.js', 'C#', '.NET'],
      public: false
    }
  ],
  education: [
    {
      id: 'bogazici',
      degree: 'M.Sc.',
      field: 'Software Engineering',
      institution: 'Boğaziçi University',
      url: 'https://bogazici.edu.tr',
      start: '2013-01-01',
      end: '2016-01-01'
    },
    {
      id: 'itu',
      degree: 'B.Sc.',
      field: 'Control and Computer Engineering',
      institution: 'Istanbul Technical University',
      url: 'https://www.itu.edu.tr',
      start: '2007-01-01',
      end: '2012-01-01'
    }
  ],
  skills: {
    Frontend: [
      'React',
      'Next.js (App Router)',
      'TypeScript',
      'JavaScript',
      'Redux',
      'Zustand',
      'MUI',
      'Tailwind CSS',
      'SSR',
      'Micro-frontends',
      'Design systems'
    ],
    'Backend & data': [
      'Node.js',
      'REST APIs',
      '.NET/C#',
      'Prisma',
      'PostgreSQL',
      'MSSQL',
      'MongoDB',
      'Redis',
      'Kafka.js',
      'BigQuery',
      'ETL'
    ],
    'Platform & quality': [
      'Monorepos',
      'Turborepo',
      'Docker',
      'Kubernetes',
      'AWS',
      'Google Cloud',
      'GitHub Actions',
      'CI/CD',
      'Storybook',
      'Chromatic',
      'Jest',
      'React Testing Library',
      'Playwright',
      'Cypress'
    ],
    'AI & integrations': [
      'Dify',
      'AI-assisted workflows',
      'Slack APIs',
      'Google Ads APIs',
      'Automated notifications'
    ]
  },
  languages: [
    {
      id: 'tr',
      language: 'Turkish',
      proficiency: 'Native'
    },
    {
      id: 'en',
      language: 'English',
      proficiency: 'Fluent'
    },
    {
      id: 'es',
      language: 'Spanish',
      proficiency: 'Intermediate'
    }
  ]
}

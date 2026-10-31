import type { CustomSection, PortfolioEntryId } from "./custom-sections";
import type { Language } from "./languages";
import type { PortfolioSectionId } from "./portfolio-sections";
import type { CvLayout, PortfolioType } from "./portfolio-types";
import type { PortfolioSectionSettings } from "./section-registry";
import type { PortfolioTheme } from "./themes";

/** Verified public career content, updated from the October 2026 CV. */
export interface ProfileExperience {
  achievements: string[];
  company: string;
  companyUrl: string;
  end: string | null;
  id: string;
  position: string;
  start: string;
}
export interface ProfileProject {
  company: string;
  coverImage?: string | null;
  description: string;
  experienceId: string | null;
  id: string;
  name: string;
  public: boolean;
  skills: string[];
  sourceUrl: string | null;
  url: string | null;
}
export interface PortfolioProfile {
  about: string[];
  appearance?: {
    theme?: PortfolioTheme;
    accent: "cyan" | "violet" | "emerald";
    defaultTheme: "system" | "light" | "dark";
  };
  birthDate?: string;
  customSections?: CustomSection[];
  cvLanguage?: Language;
  cvLayout?: CvLayout;
  cvSettings?: {
    pageSize: "A4" | "LETTER";
    fontSize: 9 | 10 | 11;
    showEmail: boolean;
    showPhone: boolean;
    includeProjects: boolean;
    includeLanguages: boolean;
  };

  cvUrl?: string;
  education: {
    id: string;
    degree: string;
    field: string;
    institution: string;
    url: string;
    start: string;
    end: string;
  }[];
  email: string;
  experiences: ProfileExperience[];
  github: string;
  hero?: {
    kind: "image" | "video";
    url: string;
    poster?: string;
    position: "center" | "top" | "bottom";
    overlay: "soft" | "strong";
  };
  languages: { id: string; language: string; proficiency: string }[];
  linkedin: string;
  location: string;

  name: string;
  phone: string;
  portfolioLanguage?: Language;
  portfolioType?: PortfolioType;
  projects: ProfileProject[];
  sectionOrder?: PortfolioSectionId[];
  sectionSequence?: PortfolioEntryId[];
  sectionSettings?: PortfolioSectionSettings;
  skills: Record<string, string[]>;
  summary: string;
  templateChosen?: boolean;
  title: string;
  website: string;
}
export const profile: PortfolioProfile = {
  about: [
    "I am a frontend-focused full-stack engineer based in Barcelona. Since 2012, I have worked across fintech, SaaS, gaming and telecommunications, combining React, Next.js and TypeScript with APIs, data and cloud infrastructure.",
    "At dLocal, I work on Finance Core Frontend, Treasury Movements and commercial finance tools. My work includes reusable platform components, bank-account and entity management, spreadsheet-driven workflows, a Bank Movements Classifier with business rules and AI-assisted suggestions, and notification integrations.",
    "Previously at Toptal, I built Google Ads automation tools and an AI-assisted Assets Generator, modernized approximately ten legacy web tools, and developed Slack messaging and SEM data-processing services. Earlier roles included mobile-test automation at Scopely, publisher tools at Marfeel, and customer-service platforms supporting more than 600,000 daily interactions at Turkcell.",
    "I also build personal projects, including this portfolio and Yusuf Fitness OS: a mobile-first app for workouts, meals, daily tasks, calendar scheduling and reminders. My focus is maintainable software, clear interfaces and end-to-end product delivery.",
  ],
  education: [
    {
      degree: "M.Sc.",
      end: "2016-01-01",
      field: "Software Engineering",
      id: "bogazici",
      institution: "Boğaziçi University",
      start: "2013-01-01",
      url: "https://bogazici.edu.tr",
    },
    {
      degree: "B.Sc.",
      end: "2012-01-01",
      field: "Control and Computer Engineering",
      id: "itu",
      institution: "Istanbul Technical University",
      start: "2007-01-01",
      url: "https://www.itu.edu.tr",
    },
  ],
  email: "yilmazyu@gmail.com",
  experiences: [
    {
      achievements: [
        "Led frontend delivery across Finance Core Frontend, Treasury Movements and commercial finance tools, translating Finance and Operations requirements into maintainable workflows.",
        "Modernized the shared FCF monorepo with Turborepo, pnpm, TypeScript strict mode, MUI and tsdown. Standardized build configuration, reusable components, shared hooks and utilities.",
        "Built Treasury Movements experiences for bank-account master data, entity management, Brazil trading and cross-border flows, including spreadsheet-driven templates and counterparty workflows.",
        "Designed and delivered the Bank Movements Classifier with configurable business rules, AI-assisted suggestions, reprocessing, execution monitoring, transaction details and auditable classification decisions.",
        "Developed threaded Slack notification flows and foundations for the FCF Notifications API. Improved quality through Storybook, Chromatic, CI checks and OpenAPI, Swagger and Postman documentation.",
        "Built and improved CPQ payment tiers, fee configuration, pricing proposals, quote-sharing and Tradebook workflows.",
      ],
      company: "dLocal",
      companyUrl: "https://dlocal.com",
      end: null,
      id: "dlocal",
      position: "Software Engineer III (Frontend-focused Full Stack)",
      start: "2024-12-01",
    },
    {
      achievements: [
        "Created an AI-assisted Assets Generator using Next.js, Dify and background processing to turn interviews into editable customer success stories with review, refinement and publishing workflows.",
        "Engineered eight Google Ads automation tools for keyword generation, asset reviews and dynamic content management, from solution design through testing and deployment.",
        "Migrated approximately ten legacy web tools to Next.js. Built a centralized Slack messaging service and an ETL composer for Google Ads and BigQuery monitoring and alerts.",
      ],
      company: "Toptal",
      companyUrl: "https://www.toptal.com",
      end: "2024-10-01",
      id: "toptal",
      position: "Senior Full-Stack Engineer",
      start: "2021-10-01",
    },
    {
      achievements: [
        "Developed frontend and backend functionality for a platform enabling game engineers to launch mobile-device tests on AWS Device Farm and inspect results and reports.",
        "Supported a transition to micro-frontend architecture and Unity-related tooling.",
      ],
      company: "Scopely",
      companyUrl: "https://www.scopely.com",
      end: "2021-09-01",
      id: "scopely",
      position: "Senior Software Engineer",
      start: "2020-10-01",
    },
    {
      achievements: [
        "Modernized publisher-facing web products with React and server-side rendering.",
        "Built CLI tools and generated component playgrounds to streamline integration and testing for media-provider teams.",
      ],
      company: "Marfeel",
      companyUrl: "https://www.marfeel.com",
      end: "2020-09-01",
      id: "marfeel",
      position: "Senior Full-Stack Developer",
      start: "2019-10-01",
    },
    {
      achievements: [
        "Built and led development of WebChat, Chat Gateway and integration services supporting more than 600,000 daily interactions. Designed a multichannel gateway integrating 20+ client systems.",
        "Implemented chat configuration, transaction management and integration services with infrastructure teams.",
        "Migrated WebChat to React and Redux in a compressed delivery window. Worked across JavaScript, Node.js, C#/.NET and real-time systems while mentoring junior engineers.",
      ],
      company: "Turkcell Global Bilgi",
      companyUrl: "https://www.globalbilgi.com.tr",
      end: "2019-10-01",
      id: "turkcell",
      position: "Senior Software Engineer",
      start: "2015-04-01",
    },
    {
      achievements: [
        "Worked on speech-engine integrations, backend APIs and cross-platform application delivery.",
        "Developed text-to-speech and speech-recognition components, C++/C# web services and mobile clients using Swift and Objective-C.",
      ],
      company: "SESTEK",
      companyUrl: "https://www.sestek.com",
      end: "2015-04-01",
      id: "sestek",
      position: "Software Engineer",
      start: "2012-11-01",
    },
  ],
  github: "https://github.com/yusufyilmz",
  languages: [
    {
      id: "tr",
      language: "Turkish",
      proficiency: "Native",
    },
    {
      id: "en",
      language: "English",
      proficiency: "Fluent",
    },
    {
      id: "es",
      language: "Spanish",
      proficiency: "Intermediate",
    },
  ],
  linkedin: "https://www.linkedin.com/in/yusuf-yilmaz-01543752/",
  location: "Barcelona, Spain",
  name: "Yusuf Yilmaz",
  phone: "+34 639 464 069",
  projects: [
    {
      company: "Personal",
      description:
        "A mobile-first planning app for workouts, meals and daily tasks, with calendar scheduling, task completion, exercise details and reminders. Includes automated testing and deployment workflows.",
      experienceId: null,
      id: "fitness-os",
      name: "Yusuf Fitness OS",
      public: true,
      skills: ["Next.js", "React", "TypeScript", "Supabase", "Vitest", "GitHub Actions"],
      sourceUrl: "https://github.com/yusufyilmz/yusuf-fitness-os",
      url: "https://yusuf-fitness-os.vercel.app",
    },
    {
      company: "Personal",
      description:
        "A developer portfolio featuring project case studies, a downloadable CV and interactive AI chat. Built with a modular Next.js and TypeScript monorepo.",
      experienceId: null,
      id: "devhub",
      name: "DevHub Showcase",
      public: true,
      skills: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "MUI", "Tailwind CSS"],
      sourceUrl: "https://github.com/yusufyilmz/devhub-showcase",
      url: "https://yusufdevhub.vercel.app",
    },
    {
      company: "dLocal",
      description:
        "Configurable classification rules and AI-assisted suggestions, with reprocessing, execution monitoring, transaction details and an audit trail.",
      experienceId: "dlocal",
      id: "bank-movements-classifier",
      name: "Bank Movements Classifier",
      public: false,
      skills: ["React", "TypeScript", "REST APIs"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "dLocal",
      description:
        "Reusable frontend platform components and Treasury workflows for entities, bank accounts, Brazil trading, spreadsheet templates and counterparties.",
      experienceId: "dlocal",
      id: "treasury",
      name: "Treasury Movements & FCF Platform",
      public: false,
      skills: ["React", "TypeScript", "MUI", "Turborepo", "pnpm", "Storybook"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "dLocal",
      description:
        "Payment tiers, fee configuration, pricing proposals, quote-sharing and commercial finance workflows.",
      experienceId: "dlocal",
      id: "cpq",
      name: "CPQ & Tradebook",
      public: false,
      skills: ["React", "TypeScript"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "Toptal",
      description:
        "AI-assisted interview and success-story generation with review, refinement and publishing workflows.",
      experienceId: "toptal",
      id: "assets-generator",
      name: "TAG / Assets Generator",
      public: false,
      skills: ["Next.js", "React", "TypeScript", "Dify", "Prisma"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "Toptal",
      description:
        "Eight tools for keyword generation, asset reviews and dynamic content management, with centralized Slack notifications and BigQuery monitoring.",
      experienceId: "toptal",
      id: "ads-automation",
      name: "Google Ads Automation Tools",
      public: false,
      skills: ["Next.js", "TypeScript", "Google Ads API", "BigQuery", "Node.js"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "Scopely",
      description:
        "A web platform for launching mobile-device tests on AWS Device Farm and reviewing results and reports.",
      experienceId: "scopely",
      id: "device-testing",
      name: "Mobile Test Automation",
      public: false,
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "Marfeel",
      description:
        "React publisher products, server-side rendering, CLI tools and component playgrounds.",
      experienceId: "marfeel",
      id: "publisher-tools",
      name: "Publisher Tools & SSR",
      public: false,
      skills: ["React", "Node.js", "TypeScript", "SSR"],
      sourceUrl: null,
      url: null,
    },
    {
      company: "Turkcell Global Bilgi",
      description:
        "High-volume customer-service systems supporting 600,000+ daily interactions and a gateway integrating 20+ client systems.",
      experienceId: "turkcell",
      id: "webchat",
      name: "WebChat & Chat Gateway",
      public: false,
      skills: ["React", "Redux", "Node.js", "C#", ".NET"],
      sourceUrl: null,
      url: null,
    },
  ],
  skills: {
    "AI & integrations": [
      "Dify",
      "AI-assisted workflows",
      "Slack APIs",
      "Google Ads APIs",
      "Automated notifications",
    ],
    "Backend & data": [
      "Node.js",
      "REST APIs",
      ".NET/C#",
      "Prisma",
      "PostgreSQL",
      "MSSQL",
      "MongoDB",
      "Redis",
      "Kafka.js",
      "BigQuery",
      "ETL",
    ],
    Frontend: [
      "React",
      "Next.js (App Router)",
      "TypeScript",
      "JavaScript",
      "Redux",
      "Zustand",
      "MUI",
      "Tailwind CSS",
      "SSR",
      "Micro-frontends",
      "Design systems",
    ],
    "Platform & quality": [
      "Monorepos",
      "Turborepo",
      "Docker",
      "Kubernetes",
      "AWS",
      "Google Cloud",
      "GitHub Actions",
      "CI/CD",
      "Storybook",
      "Chromatic",
      "Jest",
      "React Testing Library",
      "Playwright",
      "Cypress",
    ],
  },
  summary:
    "Software engineer with 13+ years of experience, specializing in React, Next.js, TypeScript and frontend platform architecture, with full-stack delivery across Node.js, APIs and cloud infrastructure. I modernize complex applications, build reusable engineering platforms and deliver business-critical products in fintech, SaaS, gaming and telecommunications.",
  title: "Senior Frontend / Full-Stack Software Engineer",
  website: "https://yusufdevhub.vercel.app",
};

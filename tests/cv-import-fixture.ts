import type { CvExtraction } from "../packages/lib/src/domain/cv-import";
export const extractedCv: CvExtraction = {
  about: ["I turn ideas into useful products."],
  education: [
    {
      degree: "BSc",
      end: "2019",
      field: "Computer Science",
      institution: "Example University",
      start: "2015",
      url: null,
    },
  ],
  email: "alex@example.test",
  experiences: [
    {
      achievements: ["Built a reusable design system."],
      company: "Example Studio",
      companyUrl: null,
      end: null,
      ongoing: true,
      position: "Engineer",
      start: "2022-03",
    },
  ],
  github: null,
  isCv: true,
  languages: [{ language: "English", proficiency: "Fluent" }],
  linkedin: null,
  location: "Barcelona",
  name: "Alex Rivera",
  phone: null,
  projects: [
    {
      company: null,
      description: "A planning tool.",
      name: "Sample planner",
      skills: ["TypeScript"],
      sourceUrl: null,
      url: null,
    },
  ],
  skills: [{ group: "Engineering", items: ["TypeScript", "React"] }],
  summary: "Builds accessible digital products.",
  title: "Product Engineer",
  warnings: [],
  website: null,
};

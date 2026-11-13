import {
  CustomSectionsEditor,
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
  SkillsEditor,
} from "../../../sections/index";

export const stages = [
  {
    description: "Choose the closest match to get a suggested layout.",
    label: "Work",
    title: "Choose your work type",
  },
  {
    description: "Choose a design for your work. You can change it later.",
    label: "Layout",
    title: "Pick a portfolio layout",
  },
  {
    description: "Upload an existing CV or skip to enter your details yourself.",
    label: "CV",
    title: "Import a CV",
  },
  {
    description: "Add what you want to share. You can skip any optional section.",
    label: "Details",
    title: "Add your details",
  },
  {
    description: "Check your website and CV before saving your private draft.",
    label: "Review",
    title: "Review your draft",
  },
] as const;

export const sections = [
  { Editor: null, title: "Profile" },
  { Editor: ExperienceEditor, title: "Work experience" },
  { Editor: ProjectsEditor, title: "Projects" },
  { Editor: SkillsEditor, title: "Skills" },
  { Editor: EducationEditor, title: "Education" },
  { Editor: LanguagesEditor, title: "Languages" },
  { Editor: CustomSectionsEditor, title: "Custom sections" },
] as const;

export const progressSteps = [
  ...stages.slice(0, 3).map(({ label }) => label),
  ...sections.map(({ title }) => title),
  stages[4].label,
];

export type SetupPosition = { stage: number; section: number };

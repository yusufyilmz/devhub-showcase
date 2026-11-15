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
    description: "Choose the closest match. You can change the layout later in the editor.",
    label: "Work",
    title: "Choose your work type",
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
  stages[0].label,
  stages[1].label,
  ...sections.map(({ title }) => title),
  stages[3].label,
];

export type SetupPosition = { stage: number; section: number };

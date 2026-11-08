import type { Language } from "@shared/config";
import type { Project, ProjectWithCompanyAndSkills } from "@shared/lib/types";

export interface ProjectFormProps {
  action: string;
  initialData?: Project;
  isSubmitting: boolean;
  onSubmit: (_e: unknown) => void;
}

export type ProjectListProps = {
  projects: { id: string; title: string; description?: string }[];
};

export interface ProjectsSectionProps {
  language?: Language;
  projects: ProjectWithCompanyAndSkills[];
}

export type ProjectItemOptions = {
  language?: Language;
  project: ProjectWithCompanyAndSkills;
};

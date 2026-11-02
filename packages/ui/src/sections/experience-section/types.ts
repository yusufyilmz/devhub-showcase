import type { Language } from "@shared/config";
import type { ExperienceWithCompanyProjectAndSkills } from "@shared/lib/types";

export type ExperienceProps = {
  language?: Language;
  experience: ExperienceWithCompanyProjectAndSkills;
};

export interface ExperienceListProps {
  experiences: ExperienceWithCompanyProjectAndSkills[];
  language?: Language;
}

export type ExperienceSectionOptions = {
  experiences: ExperienceWithCompanyProjectAndSkills[];
  language?: Language;
};

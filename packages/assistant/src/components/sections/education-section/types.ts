import type { Language } from "@shared/config";
import type { Education } from "@shared/lib/types";

export interface EducationsSectionProps {
  educations: Education[];
  language?: Language;
}

export type EducationItemOptions = {
  education: Education;
  language?: Language;
};

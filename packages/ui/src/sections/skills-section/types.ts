import type { PortfolioProfile } from "@shared/config";

export type SkillGroupOptions = {
  name: string;
  skills: string[];
  rename: (name: string) => void;
  change: (skills: string[]) => void;
  remove: () => void;
};

export type SkillsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

import type { Language } from "@shared/config";
import type { Skill } from "@shared/lib/types";

export interface SkillItemProps {
  experienceYear?: string;
  name: string;
}
export interface SkillCategoryItemProps {
  name: string;
  skills: Skill[];
}
export interface SkillSectionProps {
  language?: Language;
  skills: Record<string, Skill[]>;
}

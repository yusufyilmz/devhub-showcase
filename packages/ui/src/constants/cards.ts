import type { CVCategoryType } from "@shared/lib/types";

export const CARD_IDS: Record<CVCategoryType, string> = {
  achievements: "achievement-card",
  certifications: "certification-card",
  characteristic: "characteristic-card",
  contact: "contact-card",
  education: "education-card",
  experience: "experience-card",
  languages: "language-card",
  projects: "project-card",
  referrals: "referrals-card",
  skills: "skill-card",
} as const;

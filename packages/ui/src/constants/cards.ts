import { CVCategoryType } from '@shared/lib/types'

export const CARD_IDS: Record<CVCategoryType, string> = {
  experience: 'experience-card',
  education: 'education-card',
  skills: 'skill-card',
  certifications: 'certification-card',
  projects: 'project-card',
  languages: 'language-card',
  achievements: 'achievement-card',
  referrals: 'referrals-card',
  characteristic: 'characteristic-card',
  contact: 'contact-card'
} as const

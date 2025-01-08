import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export type ExperienceRow = Database['public']['Tables']['experiences']['Row'];
export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type SkillRow = Database['public']['Tables']['skills']['Row'];
export type CompanyRow = Database['public']['Tables']['companies']['Row'];
export type EducationRow = Database['public']['Tables']['educations']['Row'];
export type ReferralRow = Database['public']['Tables']['referrals']['Row'];
export type Achievements = Database['public']['Tables']['achievements']['Row'];

export interface ProjectForGpt {
  title: ProjectRow['title'];
  description: ProjectRow['description'];
  link: ProjectRow['link'];
  role: ProjectRow['role'];
}

export interface ExperienceForGpt {
  startedAt: string;
  finishedAt: string | null;
  role: string;
  company: CompanyRow;
  projects: ProjectForGpt[];
}

export interface ExperienceForGpt {
  startedAt: string;
  finishedAt: string | null;
  role: string;
  company: CompanyRow;
  projects: ProjectForGpt[];
}

export interface ProjectWithSkills {
  id: string;
  title: string;
  skills: Skill[];
}

export interface ProjectWithCompanyAndSkills {
  id: string;
  title: string;
  description: string;
  link: string | null;
  role: string;
  public: boolean;
  company: CompanyRow;
  skills: Skill[];
  imageUrl: string | null;
}

export interface ExperienceWithCompanyProjectAndSkills {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  role: string;
  achievements: string[];
  company: CompanyRow;
  companyId: string | null;
  projects: ProjectWithSkills[];
}

export interface Skill {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  experienceYear: string | null
  type: string
  projects: Project[]
}

export interface Company {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  link: string
  experiences: Experience[]
  projects: Project[]
}

export interface Project {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  link: string | null
  imageUrl: string | null
  role: string
  public: boolean
  companyId: string | null
  company: Company | null
  skills: Skill[]
  experienceId: string | null
  experience: Experience | null
}

export interface Experience {
  id: string
  createdAt: string
  updatedAt: string
  role: string
  startedAt: string
  finishedAt: string | null
  achievements: string[]
  projects: Project[]
  skills: Skill[]
  companyId: string | null
  company: Company | null
}

export interface Education {
  id: string
  createdAt: string
  updatedAt: string
  institution: string
  institutionLink: string
  degree: string
  fieldOfStudy: string
  startedAt: string
  finishedAt: string | null
  gpa: string | null
  description: string | null
}

export interface Referral {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  relationship: string | null
  feedback: string | null
  recommendation: string | null
  contactInfo: string | null
  sessionId: string
  review?: Review | null
}

export interface Language {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  proficiency: string | null
}

export interface Certification {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  date: string
  hours: string | null
}

export interface Achievement {
  id: string
  createdAt: string
  updatedAt: string
  title: string | null
  description: string | null
}

export interface Challenge {
  id: string
  createdAt: string
  updatedAt: string
  problem: string | null
  solution: string | null
}

export interface Characteristic {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  details: string | null
}

export interface Review {
  id: string
  createdAt: string
  updatedAt: string
  comment: string | null
  state: ReviewState
  referralId: string
  referral: Referral | null
}

export enum ReviewState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type SupabaseDbClient = SupabaseClient<Database>;

export type ReviewWithReferrals = {
  id: string
  createdAt: string
  updatedAt: string
  comment: string | null
  state: ReviewState
  referralId: string
  referral: Referral
};

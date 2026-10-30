import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

export type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
export type EducationRow = Database["public"]["Tables"]["educations"]["Row"];
export type ReferralRow = Database["public"]["Tables"]["referrals"]["Row"];
export type Achievements = Database["public"]["Tables"]["achievements"]["Row"];

export interface ProjectForGpt {
  description: ProjectRow["description"];
  link: ProjectRow["link"];
  role: ProjectRow["role"];
  title: ProjectRow["title"];
}

export interface ExperienceForGpt {
  company: CompanyRow;
  finishedAt: string | null;
  projects: ProjectForGpt[];
  role: string;
  startedAt: string;
}

export interface ExperienceForGpt {
  company: CompanyRow;
  finishedAt: string | null;
  projects: ProjectForGpt[];
  role: string;
  startedAt: string;
}

export interface ProjectWithSkills {
  description?: string;
  id: string;
  skills: Skill[];
  title: string;
}

export interface ProjectWithCompanyAndSkills {
  company: CompanyRow;
  description: string;
  id: string;
  imageUrl: string | null;
  link: string | null;
  public: boolean;
  role: string;
  skills: Skill[];
  sourceUrl?: string | null;
  title: string;
}

export interface ExperienceWithCompanyProjectAndSkills {
  achievements: string[];
  company: CompanyRow;
  companyId: string | null;
  createdAt: string;
  finishedAt: string | null;
  id: string;
  projects: ProjectWithSkills[];
  role: string;
  startedAt: string;
  updatedAt: string | null;
}

export interface Skill {
  createdAt: string;
  experienceYear: string | null;
  id: string;
  name: string | null;
  projects: Project[];
  type: string;
  updatedAt: string;
}

export interface Company {
  createdAt: string;
  experiences: Experience[];
  id: string;
  link: string;
  name: string;
  projects: Project[];
  updatedAt: string;
}

export interface Project {
  company: Company | null;
  companyId: string | null;
  createdAt: string;
  description: string;
  experience: Experience | null;
  experienceId: string | null;
  id: string;
  imageUrl: string | null;
  link: string | null;
  public: boolean;
  role: string;
  skills: Skill[];
  title: string;
  updatedAt: string;
}

export interface Experience {
  achievements: string[];
  company: Company | null;
  companyId: string | null;
  createdAt: string;
  finishedAt: string | null;
  id: string;
  projects: Project[];
  role: string;
  skills: Skill[];
  startedAt: string;
  updatedAt: string;
}

export interface Education {
  createdAt: string;
  degree: string;
  description: string | null;
  fieldOfStudy: string;
  finishedAt: string | null;
  gpa: string | null;
  id: string;
  institution: string;
  institutionLink: string;
  startedAt: string;
  updatedAt: string;
}

export interface Referral {
  contactInfo: string | null;
  createdAt: string;
  feedback: string | null;
  id: string;
  name: string | null;
  recommendation: string | null;
  relationship: string | null;
  review?: Review | null;
  sessionId: string;
  updatedAt: string;
}

export interface Language {
  createdAt: string;
  id: string;
  name: string | null;
  proficiency: string | null;
  updatedAt: string;
}

export interface Certification {
  createdAt: string;
  date: string;
  hours: string | null;
  id: string;
  name: string | null;
  updatedAt: string;
}

export interface Achievement {
  createdAt: string;
  description: string | null;
  id: string;
  title: string | null;
  updatedAt: string;
}

export interface Challenge {
  createdAt: string;
  id: string;
  problem: string | null;
  solution: string | null;
  updatedAt: string;
}

export interface Characteristic {
  createdAt: string;
  details: string | null;
  id: string;
  name: string | null;
  updatedAt: string;
}

export interface Review {
  comment: string | null;
  createdAt: string;
  id: string;
  referral: Referral | null;
  referralId: string;
  state: ReviewState;
  updatedAt: string;
}

export enum ReviewState {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export type SupabaseDbClient = SupabaseClient<Database>;

export type ReviewWithReferrals = {
  id: string;
  createdAt: string;
  updatedAt: string;
  comment: string | null;
  state: ReviewState;
  referralId: string;
  referral: Referral;
};

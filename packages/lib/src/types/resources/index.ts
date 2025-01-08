//TODO: temporaliy disable this file
// import { Education } from '../prisma/education'
// import { ExperienceWithCompanyProjectAndSkills } from '../prisma/experience'
// import { ProjectWithCompanyAndSkills } from '../prisma/project'
// import { Referral } from '../prisma/referral'
// import { Skill } from '../prisma/skill'

import { Education, ExperienceWithCompanyProjectAndSkills, ProjectWithCompanyAndSkills, Referral, Skill } from "../supabase"

export type PageResources = {
  experiences: ExperienceWithCompanyProjectAndSkills[]
  projects: ProjectWithCompanyAndSkills[]
  educations: Education[]
  referrals: Referral[]
  skills: Record<string, Skill[]>
}

export abstract class ResourceService<T> {
  abstract createGPTModal?(): Promise<string>;
  abstract getById?(id: string): Promise<T | null>;
  abstract getAll(): Promise<T[]>
  abstract create?(item: T): Promise<T>;
  abstract update?(id: string, item: T): Promise<T>;
}

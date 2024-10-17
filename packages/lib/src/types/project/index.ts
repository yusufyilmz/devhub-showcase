import { Prisma } from '@prisma/client'
import {
  ProjectForCvModelArgs,
  ProjectWithCompanyAndSkillsArgs
} from './prisma-args'

export type { Project } from '@prisma/client'

export * from './prisma-args'

export type ProjectWithCompanyAndSkills = Prisma.ProjectGetPayload<
  typeof ProjectWithCompanyAndSkillsArgs
>

export type ProjectForCvModel = Prisma.ProjectGetPayload<
  typeof ProjectForCvModelArgs
>

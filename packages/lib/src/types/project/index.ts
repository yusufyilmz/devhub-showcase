import { Prisma } from '@prisma/client'
import {
  ProjectForGptModelArgs,
  ProjectWithCompanyAndSkillsArgs
} from './prisma-args'

export type { Project } from '@prisma/client'

export type ProjectUpdateInput = Prisma.ProjectUpdateInput

export * from './prisma-args'

export type ProjectWithCompanyAndSkills = Prisma.ProjectGetPayload<
  typeof ProjectWithCompanyAndSkillsArgs
>

export type ProjectForGptModel = Prisma.ProjectGetPayload<
  typeof ProjectForGptModelArgs
>

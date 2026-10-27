import type { Prisma } from '@prisma/client'
import type {
  ExperienceForGptModelArgs,
  ExperienceWithCompanyProjectAndSkillsArgs
} from './prisma-args'

export type { Experience } from '@prisma/client'

export type ExperienceForGptModel = Prisma.ExperienceGetPayload<
  typeof ExperienceForGptModelArgs
>

export type ExperienceWithCompanyProjectAndSkills = Prisma.ExperienceGetPayload<
  typeof ExperienceWithCompanyProjectAndSkillsArgs
>

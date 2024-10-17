import { Prisma } from '@prisma/client'
import {
  ExperienceForCvModelArgs,
  ExperienceWithCompanyProjectAndSkillsArgs
} from './prisma-args'

export type { Experience } from '@prisma/client'

export type ExperienceForCvModel = Prisma.ExperienceGetPayload<
  typeof ExperienceForCvModelArgs
>

export type ExperienceWithCompanyProjectAndSkills = Prisma.ExperienceGetPayload<
  typeof ExperienceWithCompanyProjectAndSkillsArgs
>

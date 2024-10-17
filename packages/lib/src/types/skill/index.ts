import { Prisma } from '@prisma/client'
import { SkillForCvModelArgs } from './prisma-args'

export type { Skill } from '@prisma/client'

export type SkillForCvModel = Prisma.SkillGetPayload<
  typeof SkillForCvModelArgs
>

import type { Prisma } from '@prisma/client'
import type { EducationForGptModelArgs } from './prisma-args'

export type { Education } from '@prisma/client'

export type EducationForGptModel = Prisma.EducationGetPayload<
  typeof EducationForGptModelArgs
>

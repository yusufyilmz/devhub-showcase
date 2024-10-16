import { Prisma } from '@prisma/client'
import { EducationForGptModelArgs } from './prisma-args'

export type { Education } from '@prisma/client'

export type EducationForGptModel = Prisma.EducationGetPayload<
  typeof EducationForGptModelArgs
>

import { Prisma } from '@prisma/client'
import { EducationForCvModelArgs } from './prisma-args'

export type { Education } from '@prisma/client'

export type EducationForCvModel = Prisma.EducationGetPayload<
  typeof EducationForCvModelArgs
>

import { Prisma } from '@prisma/client'
import { AchievementForCvModelArgs } from './prisma-args'

export type { Achievement } from '@prisma/client'

export type AchievementForCvModel = Prisma.AchievementGetPayload<
  typeof AchievementForCvModelArgs
>

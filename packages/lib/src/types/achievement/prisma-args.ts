import { Prisma } from '@prisma/client'

export const AchievementForCvModelArgs =
  Prisma.validator<Prisma.AchievementDefaultArgs>()({
    select: {
      title: true,
      description: true
    }
  })

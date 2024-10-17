import { Prisma } from '@prisma/client'

export const SkillForCvModelArgs =
  Prisma.validator<Prisma.SkillDefaultArgs>()({
    select: {
      name: true,
      experienceYear: true,
      type: true
    }
  })

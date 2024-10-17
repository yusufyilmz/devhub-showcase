import { Prisma } from '@prisma/client'

export const LanguageForCvModelArgs =
  Prisma.validator<Prisma.LanguageDefaultArgs>()({
    select: {
      name: true,
      proficiency: true
    }
  })

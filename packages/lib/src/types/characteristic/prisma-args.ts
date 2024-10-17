import { Prisma } from '@prisma/client'

export const CharacteristicForCvModelArgs =
  Prisma.validator<Prisma.CharacteristicDefaultArgs>()({
    select: {
      name: true,
      details: true
    }
  })

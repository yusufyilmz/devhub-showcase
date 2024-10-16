import { Prisma } from '@prisma/client'

export const ReferralForGptModelArgs =
  Prisma.validator<Prisma.ReferralDefaultArgs>()({
    select: {
      name: true,
      relationship: true,
      feedback: true,
      recommendation: true,
      contactInfo: true
    }
  })

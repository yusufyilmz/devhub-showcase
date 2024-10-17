import { Prisma } from '@prisma/client'

export const ReferralForCvModelArgs =
  Prisma.validator<Prisma.ReferralDefaultArgs>()({
    select: {
      name: true,
      relationship: true,
      feedback: true,
      recommendation: true,
      contactInfo: true
    }
  })

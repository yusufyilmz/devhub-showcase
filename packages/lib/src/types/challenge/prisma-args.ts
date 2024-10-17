import { Prisma } from '@prisma/client'

export const ChallengeForCvModelArgs =
  Prisma.validator<Prisma.ChallengeDefaultArgs>()({
    select: {
      problem: true,
      solution: true
    }
  })

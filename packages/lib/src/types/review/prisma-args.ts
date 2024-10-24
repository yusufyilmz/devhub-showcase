import { Prisma } from '@prisma/client'

export const ReviewWithReferralsArgs =
  Prisma.validator<Prisma.ReviewDefaultArgs>()({
    include: {
      referral: {
        select: {
          id: true,
          name: true,
          recommendation: true,
          contactInfo: true,
          feedback: true,
          relationship: true
        }
      }
    }
  })

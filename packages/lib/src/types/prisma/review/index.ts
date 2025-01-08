import { Prisma } from '@prisma/client'
import { ReviewWithReferralsArgs } from './prisma-args'

export type { Review } from '@prisma/client'
export { ReviewState } from '@prisma/client'

export type ReviewWithReferrals = Prisma.ReviewGetPayload<
  typeof ReviewWithReferralsArgs
>

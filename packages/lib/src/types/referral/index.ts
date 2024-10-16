import { Prisma } from '@prisma/client'
import { ReferralForGptModelArgs } from './prisma-args'

export type { Referral } from '@prisma/client'

export type ReferralForGptModel = Prisma.ReferralGetPayload<
  typeof ReferralForGptModelArgs
>

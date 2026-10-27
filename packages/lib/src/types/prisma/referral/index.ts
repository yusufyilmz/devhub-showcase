import type { Prisma } from '@prisma/client'
import type { ReferralForGptModelArgs } from './prisma-args'

export type { Referral } from '@prisma/client'

export type ReferralForGptModel = Prisma.ReferralGetPayload<
  typeof ReferralForGptModelArgs
>

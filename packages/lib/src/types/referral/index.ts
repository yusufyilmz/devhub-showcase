import { Prisma } from '@prisma/client'
import { ReferralForCvModelArgs } from './prisma-args'

export type { Referral } from '@prisma/client'

export type ReferralForCvModel = Prisma.ReferralGetPayload<
  typeof ReferralForCvModelArgs
>

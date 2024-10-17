import { Prisma } from '@prisma/client'
import { ChallengeForCvModelArgs } from './prisma-args'

export type { Challenge } from '@prisma/client'

export type ChallengeForCvModel = Prisma.ChallengeGetPayload<
  typeof ChallengeForCvModelArgs
>

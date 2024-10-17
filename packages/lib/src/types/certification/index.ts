import { Prisma } from '@prisma/client'
import { CertificationForCvModelArgs } from './prisma-args'

export type { Certification } from '@prisma/client'

export type CertificationForCvModel = Prisma.CertificationGetPayload<
  typeof CertificationForCvModelArgs
>

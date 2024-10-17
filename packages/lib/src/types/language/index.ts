import { Prisma } from '@prisma/client'
import { LanguageForCvModelArgs } from './prisma-args'

export type { Language } from '@prisma/client'

export type LanguageForCvModel = Prisma.LanguageGetPayload<
  typeof LanguageForCvModelArgs
>

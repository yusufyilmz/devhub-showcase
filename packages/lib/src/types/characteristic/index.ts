import { Prisma } from '@prisma/client'
import { CharacteristicForCvModelArgs } from './prisma-args'

export type { Characteristic } from '@prisma/client'

export type CharacteristicForCvModel = Prisma.CharacteristicGetPayload<
  typeof CharacteristicForCvModelArgs
>

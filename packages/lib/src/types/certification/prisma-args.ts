import { Prisma } from '@prisma/client'

export const CertificationForCvModelArgs =
  Prisma.validator<Prisma.CertificationDefaultArgs>()({
    select: {
      name: true,
      hours: true,
      date: true
    }
  })

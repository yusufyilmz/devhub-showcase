import { Prisma } from '@prisma/client'

export const EducationForCvModelArgs =
  Prisma.validator<Prisma.EducationDefaultArgs>()({
    select: {
      institution: true,
      institutionLink: true,
      degree: true,
      fieldOfStudy: true,
      startedAt: true,
      finishedAt: true,
      gpa: true,
      description: true
    }
  })

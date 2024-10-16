import { Prisma } from '@prisma/client'

export const EducationForGptModelArgs =
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

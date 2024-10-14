import { Prisma } from '@prisma/client'

export const ProjectWithCompanyArgs =
  Prisma.validator<Prisma.ProjectDefaultArgs>()({
    include: {
      company: {
        select: {
          name: true,
          url: true,
          id: true
        }
      }
    }
  })

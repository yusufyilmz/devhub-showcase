import { Prisma } from '@prisma/client'

export const CompanyWithProjectsArgs =
  Prisma.validator<Prisma.CompanyDefaultArgs>()({
    include: {
      projects: {
        select: {
          title: true,
          id: true,
          link: true
        }
      }
    }
  })

export const CompanyForGptModelArgs =
  Prisma.validator<Prisma.CompanyDefaultArgs>()({
    select: {
      name: true,
      link: true,
      projects: {
        select: {
          title: true
        }
      }
    }
  })

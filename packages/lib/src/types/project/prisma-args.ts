import { Prisma } from '@prisma/client'

export const ProjectWithCompanyAndSkillsArgs =
  Prisma.validator<Prisma.ProjectDefaultArgs>()({
    include: {
      company: {
        select: {
          name: true,
          link: true,
          id: true
        }
      },
      skills: {
        select: {
          name: true
        }
      }
    }
  })

export const ProjectForCvModelArgs =
  Prisma.validator<Prisma.ProjectDefaultArgs>()({
    select: {
      title: true,
      description: true,
      link: true,
      role: true,
      company: {
        select: {
          name: true,
          link: true
        }
      },
      skills: {
        select: {
          name: true
        }
      }
    }
  })

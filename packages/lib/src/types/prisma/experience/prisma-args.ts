import { Prisma } from '@prisma/client'

export const ExperienceForGptModelArgs =
  Prisma.validator<Prisma.ExperienceDefaultArgs>()({
    select: {
      startedAt: true,
      finishedAt: true,
      role: true,
      company: {
        select: {
          name: true,
          link: true
        }
      },
      projects: {
        select: {
          title: true,
          description: true,
          link: true,
          role: true
        }
      }
    }
  })

export const ExperienceWithCompanyProjectAndSkillsArgs =
  Prisma.validator<Prisma.ExperienceDefaultArgs>()({
    select: {
      id: true,
      startedAt: true,
      finishedAt: true,
      role: true,
      achievements: true,
      company: {
        select: {
          name: true,
          link: true
        }
      },
      projects: {
        select: {
          id: true,
          title: true,
          skills: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

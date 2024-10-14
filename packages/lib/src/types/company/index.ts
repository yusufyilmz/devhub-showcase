import { Prisma } from '@prisma/client'
import { CompanyWithProjectsArgs } from './prisma-args'

export * from './prisma-args'

export type CompanyWithProjects = Prisma.CompanyGetPayload<
  typeof CompanyWithProjectsArgs
>

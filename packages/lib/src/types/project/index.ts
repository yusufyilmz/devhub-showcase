import { Prisma } from '@prisma/client'
import { ProjectWithCompanyArgs } from './prisma-args'

export * from './prisma-args'

export type ProjectWithCompany = Prisma.ProjectGetPayload<
  typeof ProjectWithCompanyArgs
>

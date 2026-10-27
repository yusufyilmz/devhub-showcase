import type { Prisma } from '@prisma/client'
import type {
  CompanyForGptModelArgs,
  CompanyWithProjectsArgs
} from './prisma-args'

export type { Company } from '@prisma/client'

export type CompanyWithProjects = Prisma.CompanyGetPayload<
  typeof CompanyWithProjectsArgs
>

export type CompanyForGptModel = Prisma.CompanyGetPayload<
  typeof CompanyForGptModelArgs
>

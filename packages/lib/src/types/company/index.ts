import { Prisma } from '@prisma/client'
import { CompanyForCvModelArgs, CompanyWithProjectsArgs } from './prisma-args'

export type { Company } from '@prisma/client'

export type CompanyWithProjects = Prisma.CompanyGetPayload<
  typeof CompanyWithProjectsArgs
>

export type CompanyForCvModel = Prisma.CompanyGetPayload<
  typeof CompanyForCvModelArgs
>

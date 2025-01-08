import { db, DbClient } from '../../../../db'
import { ResourceService } from '../../../../types'
import type { Company } from '../../../../types/prisma/company'
import { CompanyForGptModelArgs } from '../../../../types/prisma/company/prisma-args'
import { companyFormatter } from '../../../formatter'

export class CompanyService implements ResourceService<Company> {
  constructor(private readonly dbClient: DbClient = db) { }

  async getAll(): Promise<Company[]> {
    return this.dbClient.company.findMany()
  }

  async createGPTModal(): Promise<string> {
    const companies = await this.dbClient.company.findMany({
      ...CompanyForGptModelArgs
    })

    return companyFormatter(companies)
  }

  async getById(id: string): Promise<Company | null> {
    return this.dbClient.company.findUnique({
      where: { id }
    })
  }

  async create(company: Company): Promise<Company> {
    return this.dbClient.company.create({
      data: company
    })
  }
}

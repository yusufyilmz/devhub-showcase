import { db, DbClient } from '../../../db'
import type { Company } from '../../../types/company'
import { CompanyForCvModelArgs } from '../../../types/company/prisma-args'
import { companyFormatter } from '../../formatter'

export class CompanyService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllCompanies(): Promise<Company[]> {
    return this.dbClient.company.findMany()
  }

  async createGPTModal(): Promise<string> {
    const companies = await this.dbClient.company.findMany({
      ...CompanyForCvModelArgs
    })

    return companyFormatter(companies)
  }
}

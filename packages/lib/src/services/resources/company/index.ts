import type { Company } from '../../../types/company'
import { CompanyForGptModelArgs } from '../../../types/company/prisma-args'
import { companyFormatter } from '../../formatter'
import { ResourceService } from '../base'

export class CompanyService extends ResourceService<Company> {
  async getAll(): Promise<Company[]> {
    
    super.ge
    const companies = await this.cacheService.has<Company[]>('companies')
    if (companies) {
      return companies
    } else {
      const companies = await this.dbClient.company.findMany()

      await this.cacheService.set('companies', companies)

      return companies
    }

  }

  async createGPTModal(): Promise<string> {
    const companies = await this.dbClient.company.findMany({
      ...CompanyForGptModelArgs
    })

    return companyFormatter(companies)
  }
}

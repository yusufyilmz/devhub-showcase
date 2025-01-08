import { ResourceService } from '../../../../types';
import { Company, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class CompanyService implements ResourceService<Company> {

  private readonly dbClient: SupabaseDbClient

  constructor(client: SupabaseDbClient) {
    this.dbClient = client
  }

  async getAll(): Promise<Company[]> {

    const { data, error } = await this.dbClient

      .from('companies')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<Company[]>(data);
  }

  async createGPTModal(): Promise<string> {

    const { data, error } = await this.dbClient

      .from('companies')
      .select(`
        name,
        link,
        experiences (
          role,
          started_at,
          finished_at
        ),
        projects (
          title,
          description,
          link,
          role
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    return companyFormatter(keysToCamelCase<Company[]>(data));
  }
}

export const companyFormatter = (
  companies: Company[]
): string => {
  return companies
    .map(
      company =>
        `Company: ${company.name}, Link: ${company.link}`
    )
    .join('\n');
}

import { ResourceService } from '../../../../types';
import { Education, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class EducationService implements ResourceService<Education> {
  private readonly dbClient: SupabaseDbClient

  constructor(client: SupabaseDbClient) {
    this.dbClient = client
  }

  async getAll(): Promise<Education[]> {

    const { data, error } = await this.dbClient

      .from('educations')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<Education[]>(data);
  }

  async createGPTModal(): Promise<string> {

    const { data, error } = await this.dbClient

      .from('educations')
      .select(`
        institution,
        degree,
        field_of_study,
        started_at,
        finished_at,
        gpa,
        description
      `);

    if (error) {
      throw new Error(error.message);
    }

    return educationFormatter(keysToCamelCase<Education[]>(data));
  }
}

export const educationFormatter = (
  educations: Education[]
): string => {
  return educations
    .map(
      edu =>
        `Education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}, from ${edu.startedAt} to ${edu.finishedAt || 'present'}`
    )
    .join('\n');
}

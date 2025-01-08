import { ResourceService } from '../../../../types';
import { Skill, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class SkillService implements ResourceService<Skill> {
  private readonly dbClient: SupabaseDbClient

  constructor(client: SupabaseDbClient) {
    this.dbClient = client
  }

  async getAll(): Promise<Skill[]> {

    const { data, error } = await this.dbClient

      .from('skills')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<Skill[]>(data);
  }

  async getCategorizedSkills(): Promise<Record<string, Skill[]>> {

    const { data, error } = await this.dbClient

      .from('skills')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    const skills = keysToCamelCase<Skill[]>(data);

    const categorizedSkills = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.type]) acc[skill.type] = [];
        acc[skill.type]?.push(skill);
        return acc;
      },
      {} as Record<string, Skill[]>
    );

    return categorizedSkills;
  }
}

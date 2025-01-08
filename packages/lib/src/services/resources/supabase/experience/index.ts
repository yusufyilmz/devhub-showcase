import { ResourceService } from '../../../../types';
import { Experience, ExperienceWithCompanyProjectAndSkills, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class ExperienceService implements ResourceService<ExperienceWithCompanyProjectAndSkills> {
  private readonly dbClient: SupabaseDbClient

  constructor(client: SupabaseDbClient) {
    this.dbClient = client
  }

  async getAll(): Promise<ExperienceWithCompanyProjectAndSkills[]> {
    const { data: experiences, error: experiencesError } = await this.dbClient
      .from('experiences')
      .select(`
      *,
      company:companies(*)
    `);

    if (experiencesError) {
      throw new Error(experiencesError.message);
    }

    console.log('experiences', experiences);

    const { data: projects, error: projectsError } = await this.dbClient
      .from('projects')
      .select(`
      *,
      skills:project_skills(skill_id, skills(*))
    `);

    if (projectsError) {
      throw new Error(projectsError.message);
    }

    const experiencesWithProjectsAndSkills = experiences.map(experience => {
      const experienceProjects = projects.filter(project => project.experienceId === experience.id);

      return {
        ...experience,
        projects: experienceProjects
      };
    });

    return keysToCamelCase<ExperienceWithCompanyProjectAndSkills[]>(experiencesWithProjectsAndSkills);
  }

  async createGPTModal(): Promise<string> {
    const { data, error } = await this.dbClient

      .from('experiences')
      .select(`
        role,
        company:companies(name),
        startedAt,
        finishedAt
      `)

    if (error) {
      throw new Error(error.message)
    }

    return experienceFormatter(keysToCamelCase<Experience[]>(data))
  }
}

export const experienceFormatter = (
  experiences: Experience[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}

import { ResourceService } from '../../../../types';
import { ProjectWithCompanyAndSkills, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class ProjectService implements ResourceService<ProjectWithCompanyAndSkills> {
  private readonly dbClient: SupabaseDbClient

  constructor(client: SupabaseDbClient) {
    this.dbClient = client
  }

  async getAll(): Promise<ProjectWithCompanyAndSkills[]> {
    const { data: projects, error: projectsError } = await this.dbClient
      .from('projects')
      .select(`
      *,
      company:companies(*)
    `);

    if (projectsError) {
      throw new Error(projectsError.message);
    }

    console.log({ projects });

    const { data: projectSkills, error: projectSkillsError } = await this.dbClient
      .from('project_skills')
      .select(`
      project_id,
      skill:skills(*)
    `);

    if (projectSkillsError) {
      throw new Error(projectSkillsError.message);
    }


    const projectsWithSkills = projects.map(project => {
      const skills = projectSkills
        .filter(ps => ps.project_id === project.id)
        .map(ps => ps.skill);

      return {
        ...project,
        skills
      };
    });

    return keysToCamelCase<ProjectWithCompanyAndSkills[]>(projectsWithSkills);
  }

  async createGPTModal(): Promise<string> {

    const { data, error } = await this.dbClient

      .from('projects')
      .select(`
        title,
        description,
        link,
        role,
        company:companies(name, link),
        skills:skills(name)
      `);

    if (error) {
      throw new Error(error.message);
    }

    return projectFormatter(keysToCamelCase<ProjectWithCompanyAndSkills[]>(data));
  }
}

export const projectFormatter = (
  projects: ProjectWithCompanyAndSkills[]
): string => {
  return projects
    .map(
      project =>
        `Project: ${project.title}, Description: ${project.description}, Company: ${project.company?.name}, Skills: ${project.skills.map(skill => skill.name).join(', ')}`
    )
    .join('\n');
}

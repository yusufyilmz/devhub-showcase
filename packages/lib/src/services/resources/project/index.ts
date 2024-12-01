import {
  ProjectForGptModelArgs,
  ProjectWithCompanyAndSkills,
  ProjectWithCompanyAndSkillsArgs,
  Project
} from '../../../types/project'
import { projectFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class ProjectService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllProjects(): Promise<Project[]> {
    return this.dbClient.project.findMany()
  }

  async getAllProjectsWithCompanies(): Promise<ProjectWithCompanyAndSkills[]> {
    return this.dbClient.project.findMany({
      ...ProjectWithCompanyAndSkillsArgs
    })
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.project.findMany({
      ...ProjectForGptModelArgs
    })

    return projectFormatter(experiences)
  }
}

import {
  ProjectForCvModelArgs,
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
      ...ProjectForCvModelArgs
    })

    return projectFormatter(experiences)
  }

  // async getProjectById(id: string): Promise<Project> {
  //   const project = await this.prisma.project.findUnique({
  //     where: { id }
  //   })

  //   if (!project) {
  //     throw new NotFoundError(`Project with id ${id} not found`)
  //   }

  //   return project
  // }

  // async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
  //   return this.prisma.project.create({
  //     data
  //   })
  // }

  // async updateProject(
  //   id: string,
  //   data: Prisma.ProjectUpdateInput
  // ): Promise<Project> {
  //   const project = await this.prisma.project.update({
  //     where: { id },
  //     data
  //   })

  //   return project
  // }

  // async deleteProject(id: string): Promise<Project> {
  //   const project = await this.prisma.project.delete({
  //     where: { id }
  //   })

  //   return project
  // }
}

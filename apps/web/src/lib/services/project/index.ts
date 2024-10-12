import type { Prisma, Project } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@shared/lib'

export class ProjectService {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async getAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany()
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      throw new NotFoundError(`Project with id ${id} not found`)
    }

    return project
  }

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data
    })
  }

  async updateProject(
    id: string,
    data: Prisma.ProjectUpdateInput
  ): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data
    })

    return project
  }

  async deleteProject(id: string): Promise<Project> {
    const project = await this.prisma.project.delete({
      where: { id }
    })

    return project
  }
}

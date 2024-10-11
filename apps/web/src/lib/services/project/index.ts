import { Prisma, PrismaClient } from '@prisma/client'
import { NotFoundError } from '@shared/utils'

export class ProjectService {
  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async getAllProjects() {
    return this.prisma.project.findMany()
  }

  async getProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      throw new NotFoundError(`Project with id ${id} not found`)
    }

    return project
  }

  async createProject(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({
      data
    })
  }

  async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await this.prisma.project.update({
      where: { id },
      data
    })

    if (!project) {
      throw new NotFoundError(`Project with id ${id} not found`)
    }

    return project
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.delete({
      where: { id }
    })

    if (!project) {
      throw new NotFoundError(`Project with id ${id} not found`)
    }

    return project
  }
}

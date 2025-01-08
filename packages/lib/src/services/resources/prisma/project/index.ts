import { DbClient, db } from '../../../../db'
import { ResourceService } from '../../../../types'
import {
  Project,
  ProjectForGptModelArgs
} from '../../../../types/prisma/project'
import { projectFormatter } from '../../../formatter'

export class ProjectService implements ResourceService<Project> {
  constructor(private readonly dbClient: DbClient = db) { }

  async getAll(): Promise<Project[]> {
    return this.dbClient.project.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.project.findMany({
      ...ProjectForGptModelArgs
    })

    return projectFormatter(experiences)
  }
}

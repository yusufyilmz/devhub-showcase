import { db, DbClient } from '../../../../db'
import { ResourceService } from '../../../../types'
import type { Education } from '../../../../types/prisma/education'
import { EducationForGptModelArgs } from '../../../../types/prisma/education/prisma-args'
import { educationFormatter } from '../../../formatter'

export class EducationService implements ResourceService<Education> {
  constructor(private readonly dbClient: DbClient = db) { }

  async getAll(): Promise<Education[]> {
    return this.dbClient.education.findMany()
  }

  async createGPTModal(): Promise<string> {
    const educations = await this.dbClient.education.findMany({
      ...EducationForGptModelArgs
    })

    return educationFormatter(educations)
  }
}

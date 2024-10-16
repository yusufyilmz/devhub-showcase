import { db, DbClient } from '../../db'
import type { Education } from '../../types/education'
import { EducationForGptModelArgs } from '../../types/education/prisma-args'
import { educationFormatter } from '../formatter'

export class EducationService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllEducations(): Promise<Education[]> {
    return this.dbClient.education.findMany()
  }

  async createGPTModal(): Promise<string> {
    const educations = await this.dbClient.education.findMany({
      ...EducationForGptModelArgs
    })

    return educationFormatter(educations)
  }
}

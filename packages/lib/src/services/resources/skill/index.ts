import { Skill } from '../../../types/skill'
import { SkillForCvModelArgs } from '../../../types/skill/prisma-args'
import { skillFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class SkillService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllSkills(): Promise<Skill[]> {
    return this.dbClient.skill.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.skill.findMany({
      ...SkillForCvModelArgs
    })

    return skillFormatter(experiences)
  }
}

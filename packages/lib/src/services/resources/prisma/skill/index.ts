import { DbClient, db } from '../../../../db'
import { ResourceService } from '../../../../types'
import { Skill } from '../../../../types/prisma/skill'

export class SkillService implements ResourceService<Skill> {
  constructor(private readonly dbClient: DbClient = db) { }

  async getAll(): Promise<Skill[]> {
    return this.dbClient.skill.findMany()
  }

  async getCategorizedSkills(): Promise<Record<string, Skill[]>> {
    const skills = await this.dbClient.skill.findMany()

    const categorizedSkills = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.type]) acc[skill.type] = []
        acc[skill.type]?.push(skill)
        return acc
      },
      {} as Record<string, Skill[]>
    )

    return categorizedSkills
  }

  // async getAllSkillsWithCompanies(): Promise<SkillWithCompanyAndSkills[]> {
  //   return this.dbClient.skill.findMany({
  //     ...SkillWithCompanyAndSkillsArgs
  //   })
  // }

  // async createGPTModal(): Promise<string> {
  //   const experiences = await this.dbClient.skill.findMany({
  //     ...SkillForGptModelArgs
  //   })

  //   return skillFormatter(experiences)
  // }
}

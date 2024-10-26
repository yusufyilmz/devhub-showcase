import { Skill } from '../../types/skill'
import { DbClient, db } from '../../db'

export class SkillService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllSkills(): Promise<Skill[]> {
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

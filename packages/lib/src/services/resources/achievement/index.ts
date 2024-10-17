import { Achievement } from '../../../types/achievement'
import { AchievementForCvModelArgs } from '../../../types/achievement/prisma-args'
import { achievementFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class AchievementService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllAchievements(): Promise<Achievement[]> {
    return this.dbClient.achievement.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.achievement.findMany({
      ...AchievementForCvModelArgs
    })

    return achievementFormatter(experiences)
  }
}

import { Challenge } from '../../../types/challenge'
import { ChallengeForCvModelArgs } from '../../../types/challenge/prisma-args'
import { challengeFormatter } from '../../formatter'
import { DbClient, db } from '../../../db'

export class ChallengeService {
  constructor(private readonly dbClient: DbClient = db) {}

  async getAllChallenges(): Promise<Challenge[]> {
    return this.dbClient.challenge.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.challenge.findMany({
      ...ChallengeForCvModelArgs
    })

    return challengeFormatter(experiences)
  }
}

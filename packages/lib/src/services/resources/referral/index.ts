import { DbClient, db } from '../../../db'
import { ReferralForCvModelArgs } from '../../../types/referral/prisma-args'
import { referralFormatter } from '../../formatter'
import { Referral } from '../../../types'
import { logger } from '../../../log'

export class ReferralService {
  constructor(
    private readonly dbClient: DbClient = db
  ) {}

  async getAllReferrals(): Promise<Referral[]> {
    return this.dbClient.referral.findMany()
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.referral.findMany({
      ...ReferralForCvModelArgs
    })

    return referralFormatter(experiences)
  }

  saveReferral = async (
    category: string,
    answer: string,
    sessionId: string
  ): Promise<void> => {
    const log = logger.child({ category, answer, sessionId })

    try {
      log.debug('Saving referral answer')

      const response = await this.dbClient.referral.upsert({
        where: { sessionId },
        update: {
          [category]: answer
        },
        create: {
          sessionId,
          [category]: answer
        }
      })

      log.debug({ response }, 'Referral answer saved')
    } catch (error) {
      log.error({ error }, 'Error saving referral answer')
    }
  }
}

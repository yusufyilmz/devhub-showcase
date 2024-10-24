import type { Logger } from 'pino'
import { DbClient, db } from '../../db'
import { ReferralForGptModelArgs } from '../../types/referral/prisma-args'
import { referralFormatter } from '../formatter'
import { Referral } from '../../types'
import { ReviewState } from '@prisma/client'

export class ReferralService {
  constructor(
    private logger: Logger,
    private readonly dbClient: DbClient = db
  ) {}

  async getApprovedReferrals(): Promise<Referral[]> {
    return this.dbClient.referral.findMany({
      where: {
        review: {
          state: ReviewState.APPROVED
        }
      }
    })
  }

  async createGPTModal(): Promise<string> {
    const experiences = await this.dbClient.referral.findMany({
      ...ReferralForGptModelArgs
    })

    return referralFormatter(experiences)
  }

  saveReferral = async (
    category: string,
    answer: string,
    sessionId: string
  ): Promise<void> => {
    const logger = this.logger.child({ category, answer, sessionId })

    try {
      logger.debug('Saving referral answer')

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

      logger.debug({ response }, 'Referral answer saved')
    } catch (error) {
      logger.error({ error }, 'Error saving referral answer')
    }
  }
}

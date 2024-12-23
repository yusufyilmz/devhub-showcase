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
        OR: [
          {
            review: {
              state: ReviewState.APPROVED
            }
          },
          {
            review: {
              is: null
            }
          }
        ]
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

      const review = await this.dbClient.review.findUnique({
        where: {
          referralId: response.id
        }
      })

      if (!review) {
        await this.dbClient.review.create({
          data: {
            referralId: response.id,
            state: ReviewState.PENDING
          }
        })
      } else if (review.state === ReviewState.REJECTED) {
        await this.dbClient.review.update({
          where: {
            referralId: response.id
          },
          data: {
            state: ReviewState.PENDING
          }
        })
      }

      logger.debug({ response }, 'Referral answer saved')
    } catch (error) {
      logger.error({ error }, 'Error saving referral answer')
    }
  }
}

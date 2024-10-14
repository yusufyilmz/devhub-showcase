import { PrismaClient } from '@prisma/client'
import type { Logger } from 'pino'

export class ReferralService {
  constructor(
    private logger: Logger,
    private readonly prisma: PrismaClient = new PrismaClient()
  ) {}

  saveReferralAnswer = async (
    category: string,
    answer: string,
    sessionId: string
  ): Promise<void> => {
    const logger = this.logger.child({ category, answer, sessionId })

    try {
      logger.debug('Saving referral answer')

      const response = await this.prisma.referral.upsert({
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

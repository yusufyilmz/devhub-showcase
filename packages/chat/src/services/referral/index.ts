import {
  ChatRole,
  ReferralMessage,
  ReferralQuestionCategory,
  validReferralCategories
} from '@shared/lib/types'
import { REFERRAL_MODAL } from '../../models/referral-modal'
import { copy } from '@shared/content'
import { Logger } from 'pino'

export class ReferralService {
  constructor(private readonly logger: Logger) {}

  private getNextReferralQuestion(
    category: ReferralQuestionCategory
  ): ReferralQuestionCategory | undefined {
    const currentIndex = validReferralCategories.indexOf(category)

    return currentIndex < validReferralCategories.length - 1
      ? validReferralCategories[currentIndex + 1]
      : undefined
  }

  createReferralMessage(userMessage: ReferralMessage): ReferralMessage {
    try {
      const nextCategory = this.getNextReferralQuestion(userMessage.category)

      if (!nextCategory) {
        return copy.chatMessages.referralGoodbyeMessage
      }

      return {
        role: ChatRole.System,
        content: REFERRAL_MODAL[nextCategory].question,
        type: 'referral',
        category: nextCategory,
        timestamp: Date.now()
      }
    } catch (error) {
      this.logger.info({ error }, 'Error processing user message.')
      return {
        ...copy.chatMessages.failureMessage,
        type: 'referral',
        category: 'error'
      }
    }
  }
}

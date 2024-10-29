'use server'

import { ReferralService, ReviewService } from '@shared/lib/services'
import { checkRateLimit, isCategoryReferralCategory } from '@shared/lib/utils'
import { logger } from '@shared/lib/logger'
import { MessageProcessor } from '@shared/chat'
import { copy } from '@shared/content'
import type {
  ReviewState,
  ChatMessage,
  ReviewWithReferrals
} from '@shared/lib/types'

const messageProcessor = new MessageProcessor(logger)
const reviewService = new ReviewService(logger)
const referralService = new ReferralService(logger)

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    if (checkRateLimit(sessionId)) {
      throw new Error(copy.notifications.errors.tooManyRequests)
    }

    if (isCategoryReferralCategory(message.category)) {
      await referralService.saveReferral(
        message.category,
        message.content,
        sessionId
      )
    }

    const botReply = await messageProcessor.processUserMessage(message)

    return botReply
  } catch (error) {
    logger.error({ error }, 'Failed to process message')
    return copy.chatMessages.failureMessage
  }
}

export async function handleSubmitReviewAction(
  referralId: string,
  reviewState: ReviewState
): Promise<ReviewWithReferrals | undefined> {
  try {
    const review = await reviewService.updateReview(referralId, reviewState)

    return review
  } catch (error) {
    logger.error({ error }, 'Error on review')

    return undefined
  }
}

'use server'

import {
  RateLimiter,
  ReferralService,
  ReviewService
} from '@shared/lib/services'
import { isCategoryReferralCategory } from '@shared/lib/utils'
import { logger } from '@shared/lib/logger'
import { failureMessage, MessageProcessor } from '@shared/chat'
import type {
  ReviewState,
  ChatMessage,
  ReviewWithReferrals
} from '@shared/lib/types'

const messageProcessor = new MessageProcessor(logger)
const reviewService = new ReviewService(logger)
const referralService = new ReferralService(logger)
const rateLimiter = new RateLimiter()

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return failureMessage

  try {
    await rateLimiter.isAllowed(sessionId)

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

    throw error
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

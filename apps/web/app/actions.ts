'use server'

import { failureMessage, MessageProcessor } from '@shared/chat'
import { logger } from '@shared/lib/logger'
import {
  RateLimiter,
  ReferralService,
  ReviewService
} from '@shared/lib/services'
import { createServerClient } from '@shared/lib/supabase'
import type {
  ChatMessage,
  ReviewState,
  ReviewWithReferrals
} from '@shared/lib/types'
import { isCategoryReferralCategory } from '@shared/lib/utils'

const messageProcessor = new MessageProcessor(logger)
const rateLimiter = new RateLimiter()

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return failureMessage

  try {
    await rateLimiter.isAllowed(sessionId)

    if (isCategoryReferralCategory(message.category)) {
      const client = await createServerClient()
      const referralService = new ReferralService(logger, client)

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
    const client = await createServerClient()
    const reviewService = new ReviewService(logger, client)
    const review = await reviewService.update(referralId, {
      state: reviewState
    })

    return review
  } catch (error) {
    logger.error({ error }, 'Error on review')

    return undefined
  }
}

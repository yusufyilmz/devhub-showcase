'use server'

import { createCVModel, failureMessage, MessageProcessor } from '@shared/chat'
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
import { requireAdmin } from '../lib/admin-auth'
import { getPublishedProfile } from '../lib/published-profile'

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return failureMessage

  try {
    if (
      !process.env.OPENAI_API_KEY ||
      !process.env.REDIS_URL ||
      !process.env.REDIS_TOKEN
    )
      return failureMessage
    const rateLimiter = new RateLimiter()
    const messageProcessor = new MessageProcessor(
      logger,
      createCVModel((await getPublishedProfile()).profile)
    )
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
    const { client } = await requireAdmin()
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

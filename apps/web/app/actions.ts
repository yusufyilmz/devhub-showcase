'use server'

import { ReferralService, ReviewService } from '@shared/lib/services'
import { isCategoryReferralCategory } from '@shared/lib/utils'
import { logger } from '@shared/lib/logger'
import { MessageProcessor } from '@shared/chat'
import { copy } from '@shared/content'
import {
  ReviewState,
  type ChatMessage,
  type ReviewWithReferrals
} from '@shared/lib/types'

const messageProcessor = new MessageProcessor(logger)
const referralService = new ReferralService(logger)
const reviewService = new ReviewService(logger)

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    if (isCategoryReferralCategory(message.category)) {
      await referralService.saveReferral(
        message.category,
        message.content,
        sessionId
      )

      await referralService.getApprovedReferrals(
        message.category,
        message.content,
        sessionId
      )
    }

    const botReply = await messageProcessor.processUserMessage(message)

    return botReply
  } catch (error) {
    return copy.chatMessages.failureMessage
  }
}

export async function handleSubmitReferralAction(
  message: ChatMessage,
  sessionId: string
): Promise<any> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    await referralService.saveReferral(
      message.category,
      message.content,
      sessionId
    )
  } catch (error) {
    return copy.chatMessages.failureMessage
  }
}

export async function handleSubmitReviewAction(
  referralId: string
): Promise<ReviewWithReferrals | undefined> {
  try {
    const review = await reviewService.updateReview(
      referralId,
      ReviewState.APPROVED
    )

    return review
  } catch (error) {
    logger.error({ error }, 'Error on review')

    return undefined
  }
}

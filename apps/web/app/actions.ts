'use server'

import { ReferralService } from '@shared/lib/services'
import { checkRateLimit, isCategoryReferralCategory } from '@shared/lib/utils'
import { logger } from '@shared/lib/logger'
import { MessageProcessor } from '@shared/chat'
import { copy } from '@shared/content'
import type { ChatMessage } from '@shared/lib/types'

const messageProcessor = new MessageProcessor(logger)
const referralService = new ReferralService(logger)

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    if (checkRateLimit(sessionId)) {
      throw copy.notifications.errors.tooManyRequests
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

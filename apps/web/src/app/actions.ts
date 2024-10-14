'use server'

import type { ChatMessage } from '@shared/lib/types'
import { ReferralService } from '@shared/lib/services'
import { isCategoryReferralCategory } from '@shared/lib/utils'
import { MessageProcessor } from '@shared/chat'
import { copy } from '@shared/content'
import logger from '@/lib/log'

const messageProcessor = new MessageProcessor(logger)
const referralService = new ReferralService(logger)

export async function handleSendMessageAction(
  message: ChatMessage,
  sessionId: string
): Promise<ChatMessage> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    if (isCategoryReferralCategory(message.category)) {
      await referralService.saveReferralAnswer(
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

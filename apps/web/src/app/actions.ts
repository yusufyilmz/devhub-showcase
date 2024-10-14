'use server'

import type { ChatMessage } from '@shared/lib'
import { MessageProcessor } from '@shared/chat'
import { copy } from '@shared/content'
import logger from '@/lib/log'

const messageProcessor = new MessageProcessor(logger)

export async function handleSendMessageAction(
  message: ChatMessage
): Promise<ChatMessage> {
  if (!message.content) return copy.chatMessages.failureMessage

  try {
    const botReply = await messageProcessor.processUserMessage(message.content)

    return botReply
  } catch (error) {
    return copy.chatMessages.failureMessage
  }
}

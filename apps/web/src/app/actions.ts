'use server'

import type { ChatMessage } from '@shared/lib'
import { FAILURE_MESSAGE, MessageProcessor } from '@shared/chat'

const messageProcessor = new MessageProcessor()

export async function handleSendMessageAction(
  message: ChatMessage
): Promise<ChatMessage> {
  if (!message.content) return FAILURE_MESSAGE

  try {
    const botReply = await messageProcessor.processUserMessage(message.content)

    return botReply
  } catch (error) {
    return FAILURE_MESSAGE
  }
}

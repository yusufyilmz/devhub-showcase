import type { ChatMessage } from '@shared/lib/types'
import { ChatRole } from '@shared/lib/types'

export function summarizeMessages(messages: ChatMessage[]): string {
  return messages
    .map(msg => {
      return `[${msg.role}] ${msg.content}`
    })
    .join('\n')
}

export function summarizeQuestions(sessionMessages: ChatMessage[]): string {
  const userMessages = sessionMessages
    .filter(msg => msg.role === ChatRole.User)
    .map(msg => msg.content)
    .join('. ')

  return userMessages.length > 0 ? `Previously asked: ${userMessages}` : ''
}

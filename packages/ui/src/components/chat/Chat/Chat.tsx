'use client'

import { useChatStore } from '../../../stores/use-chat-store'
import { ChatMessage, ChatRole, ServerResponse } from '@shared/lib'
import { ChatPopup } from '../ChatPopup/ChatPopup'
import { FAILURE_MESSAGE } from '@shared/chat'

export const Chat = () => {
  const { messages, addMessage } = useChatStore()

  const handleSendMessage = async (input: string) => {
    if (!input) return

    const newMessage = {
      role: ChatRole.User,
      content: input,
      timestamp: Date.now()
    }

    addMessage(newMessage)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: input })
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      const data = (await res.json()) as ServerResponse<ChatMessage>

      if (!data.success) {
        throw new Error('Chat API returned error')
      }

      addMessage(data.data)
    } catch (error) {
      addMessage(FAILURE_MESSAGE)
    }
  }

  return (
    <div className="p-4">
      <ChatPopup messages={messages} handleSendMessage={handleSendMessage} />
    </div>
  )
}

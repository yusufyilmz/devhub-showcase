'use client'

import { chatStore } from '@shared/ui/stores'
import { ChatRole } from '@shared/lib'
import { useStore } from 'zustand'
import { ChatPopup } from '@shared/ui/components'
import { useState } from 'react'
import { FAILURE_MESSAGE } from '@shared/chat'
import { handleSendMessageAction } from './actions'

export default function ChatContainer(): JSX.Element {
  const messages = useStore(chatStore, state => state.messages)
  const addMessage = useStore(chatStore, state => state.addMessage)
  const [isTyping, setIsTyping] = useState(true)

  const handleSendMessage = async (input: string): Promise<void> => {
    if (!input || isTyping) return

    setIsTyping(true)
    const newMessage = {
      role: ChatRole.User,
      content: input,
      timestamp: Date.now()
    }
    addMessage(newMessage)

    try {
      const serverResponse = await handleSendMessageAction(newMessage)

      addMessage(serverResponse)
    } catch {
      addMessage(FAILURE_MESSAGE)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="p-4">
      <ChatPopup
        handleSendMessage={input => {
          void handleSendMessage(input)
        }}
        isTyping={isTyping}
        messages={messages}
      />
    </div>
  )
}

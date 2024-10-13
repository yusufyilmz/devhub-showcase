'use client'

import { chatStore } from '../../../stores'
import { ChatMessage, ChatRole } from '@shared/lib'
import { useStore } from 'zustand'
import { ChatPopup } from '../ChatPopup'
import { useState } from 'react'
import { copy } from '@shared/content'

type ChatSectionProps = {
  handleSendMessage: (input: ChatMessage) => Promise<ChatMessage>
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  handleSendMessage
}): JSX.Element => {
  const messages = useStore(chatStore, state => state.messages)
  const addMessage = useStore(chatStore, state => state.addMessage)
  const [isTyping, setIsTyping] = useState(true)

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping) return

    setIsTyping(true)
    const newMessage = {
      role: ChatRole.User,
      content: input,
      timestamp: Date.now()
    }
    addMessage(newMessage)

    try {
      const response = await handleSendMessage(newMessage)

      addMessage(response)
    } catch {
      addMessage(copy.chatMessages.failureMessage)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <section id="chat">
      <div className="p-4">
        <ChatPopup
          handleSendMessage={input => {
            void handleSendMessageAction(input)
          }}
          isTyping={isTyping}
          messages={messages}
        />
      </div>
    </section>
  )
}

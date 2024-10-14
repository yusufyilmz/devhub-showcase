'use client'

import { chatStore, useChatMessages } from '../../../stores'
import { ChatMessage, ChatMessageType, ChatRole } from '@shared/lib/types'
import { useStore } from 'zustand'
import { ChatPopup } from '../ChatPopup'
import { useState } from 'react'
import { copy } from '@shared/content'

type ChatSectionProps = {
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string
  ) => Promise<ChatMessage>
  type: ChatMessageType
  className?: string
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  handleSendMessage,
  type,
  className
}): JSX.Element => {
  const sessionId = useStore(chatStore, state => state.sessionId)
  const addMessage = useStore(chatStore, state => state.addMessage)
  const messages = useChatMessages(type)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping) return

    setIsTyping(true)

    const lastMessage = messages
      .filter(message => message.type === type)
      .pop()

    const newMessage = {
      role: ChatRole.User,
      content: input,
      timestamp: Date.now(),
      type,
      category: lastMessage?.category
    } as ChatMessage

    addMessage(newMessage)

    try {
      const response = await handleSendMessage(newMessage, sessionId)

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
          className={className}
          type={type}
          handleSendMessage={input => {
            void handleSendMessageAction(input)
          }}
          isTyping={isTyping}
        />
      </div>
    </section>
  )
}

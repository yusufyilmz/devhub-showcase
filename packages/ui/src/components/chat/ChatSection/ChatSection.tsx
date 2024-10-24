'use client'

import { chatStore, useAddMessage, useChatMessages } from '../../../stores'
import { ChatMessage, ChatType, ChatRole } from '@shared/lib/types'
import { useStore } from 'zustand'
import { ChatPopup } from '../ChatPopup'
import { useEffect, useState } from 'react'
import { copy } from '@shared/content'

type ChatSectionProps = {
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string
  ) => Promise<ChatMessage>
  type: ChatType
  className?: string
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  handleSendMessage,
  type,
  className
}): JSX.Element => {
  const sessionId = useStore(chatStore, state => state.sessionId)
  const referralMessages = useStore(chatStore, state => state.referralMessages)

  console.log({ sessionId })
  console.log({ referralMessages })

  const addMessage = useAddMessage()
  const messages = useChatMessages(type)
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (message: ChatMessage): Promise<void> => {
    try {
      const response = await handleSendMessage(message, sessionId)

      addMessage(response)
    } catch {
      addMessage(copy.chatMessages.failureMessage)
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    console.log(messages)
    // if (type === 'cv') return
    // if (type === 'referral' && messages.length === 1) {
    //   void sendMessage(copy.chatMessages.welcomeMessage[type])
    // }
  }, [messages])

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping) return

    setIsTyping(true)

    const lastMessage = messages.filter(message => message.type === type).pop()

    const newMessage = {
      role: ChatRole.User,
      content: input,
      timestamp: Date.now(),
      type,
      category: lastMessage?.category
    } as ChatMessage

    addMessage(newMessage)

    sendMessage(newMessage)
  }

  return (
    <ChatPopup
      className={className}
      type={type}
      handleSendMessage={input => {
        void handleSendMessageAction(input)
      }}
      isTyping={isTyping}
    />
  )
}

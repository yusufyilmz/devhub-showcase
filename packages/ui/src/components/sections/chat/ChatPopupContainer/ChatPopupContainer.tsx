'use client'

import { type ChatMessage, ChatRole, type ChatType } from '@shared/lib/types'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { CloseIcon, IconButton } from '../../../../components'
import { failureMessage } from '../../../../constants'
import { chatStore, useChatMessages } from '../../../../stores'
import { ChatInput } from '../ChatInput'
import { ChatMessageBox } from '../ChatMessageBox'
import { TypingIndicator } from '../TypingIndicator'

interface ChatPopupProps {
  type: ChatType
  isTyping?: boolean
  className?: string
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string
  ) => Promise<ChatMessage>
  closeChat: (chatFinished: boolean) => void
}

export const ChatPopupContainer: React.FC<ChatPopupProps> = ({
  handleSendMessage,
  type,
  closeChat
}) => {
  const sessionId = useStore(chatStore, (state) => state.sessionId)
  const addMessage = useStore(chatStore, (state) => state.addMessage)
  const messages = useChatMessages(type)
  const [isTyping, setIsTyping] = useState(false)
  const [isChatFinished, setIsChatFinished] = useState(false)

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping) return

    setIsTyping(true)

    const lastMessage = messages
      .filter((message) => message.type === type)
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
    } catch (e) {
      const error = e as Error
      const message = (
        error?.message
          ? {
              role: ChatRole.System,
              content: error?.message,
              timestamp: Date.now(),
              type
            }
          : failureMessage
      ) as ChatMessage

      addMessage(message)
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    if (
      messages.length > 1 &&
      messages[messages.length - 1]?.category === 'end'
    ) {
      setIsChatFinished(true)
    }
  }, [messages])

  return (
    <div className="fixed  bottom-0 right-0 md:right-4 z-[250]">
      <div
        role="dialog"
        aria-label="Portfolio assistant"
        className="chat-panel w-[100vw] h-[100vh] md:w-full md:h-[32rem] bottom-0 bg-backgroundColor-chat md:rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out"
      >
        <IconButton
          aria-label="Close chat"
          onClick={() => {
            closeChat(isChatFinished)
          }}
          className="icon-button absolute top-2 right-2"
        >
          <CloseIcon fontSize="small" className="text-main-secondary" />
        </IconButton>
        <div className="flex flex-col h-full  transition-all duration-700 transform scale-100">
          <ChatMessageBox type={type} botIsTyping={isTyping} />
          {isTyping && <TypingIndicator />}
          <ChatInput
            type={type}
            handleSendMessage={handleSendMessageAction}
            botIsTyping={isTyping}
            chatFinished={isChatFinished}
          />
        </div>
      </div>
    </div>
  )
}

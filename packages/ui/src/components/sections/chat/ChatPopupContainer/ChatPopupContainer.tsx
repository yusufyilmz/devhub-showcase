'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { ChatMessageBox } from '../ChatMessageBox'
import { ChatMessage, ChatRole, type ChatType } from '@shared/lib/types'
import { ChatInput } from '../ChatInput'
import { IconButton, CloseIcon } from '../../../../components'
import { chatStore, useChatMessages } from '../../../../stores'
import { TypingIndicator } from '../TypingIndicator'
import { useStore } from 'zustand'
import { failureMessage } from '../../../../constants'

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
  const sessionId = useStore(chatStore, state => state.sessionId)
  const addMessage = useStore(chatStore, state => state.addMessage)
  const messages = useChatMessages(type)
  const [isTyping, setIsTyping] = useState(false)
  const [isChatFinished, setIsChatFinished] = useState(false)

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
      <div className="w-[100vw] h-[100vh] md:w-full md:h-[32rem] bottom-0 bg-backgroundColor-chat md:rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out">
        <IconButton
          aria-label="Close chat"
          onClick={() => {
            closeChat(isChatFinished)
          }}
          className="icon-button absolute top-2 right-2 text-main-dark"
        >
          <CloseIcon className="h-4 w-4" />
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

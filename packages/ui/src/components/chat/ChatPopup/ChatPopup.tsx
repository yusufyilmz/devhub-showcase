'use client'

import { useEffect, useState } from 'react'
import { ChatMessageBox } from '../ChatMessageBox'
import type { ChatMessageType } from '@shared/lib/types'
import { ChatInput } from '../ChatInput'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { copy } from '@shared/content'
import { TypingIndicator } from '../TypingIndicator'
import { useStore } from 'zustand'
import { chatStore, useChatMessages } from '../../../stores'

interface ChatPopupProps {
  type: ChatMessageType
  isTyping?: boolean
  className?: string
  // eslint-disable-next-line no-unused-vars
  handleSendMessage: (input: string) => void
}

export const ChatPopup: React.FC<ChatPopupProps> = ({
  handleSendMessage,
  isTyping,
  type,
  className
}) => {
  const resetChat = useStore(chatStore, state => state.resetChat)
  const [isOpen, setIsOpen] = useState(false)
  const [isChatFinished, setIsChatFinished] = useState(false)
  const messages = useChatMessages(type)
  const toggleChat = () => {
    setIsOpen(!isOpen)

    isChatFinished && resetChat(type)
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
    <div className={className}>
      {!isOpen && (
        <Button
          variant="contained"
          color="primary"
          className="rounded-lg shadow-2xl relative transition-all duration-300 ease-in-out focus:outline-none transform hover:scale-200"
          onClick={toggleChat}
        >
          {copy.chat[type]?.placeholder}
        </Button>
      )}

      {isOpen && (
        <div className="w-full h-[32rem] bg-backgroundColor-card rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out">
          <button
            onClick={() => {
              toggleChat()
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-main-blue focus:outline-none"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <div className="flex flex-col h-full">
            <ChatMessageBox type={type} botIsTyping={isTyping} />
            {isTyping && <TypingIndicator />}
            <ChatInput
              type={type}
              handleSendMessage={handleSendMessage}
              botIsTyping={isTyping}
              chatFinished={isChatFinished}
            />
          </div>
        </div>
      )}
    </div>
  )
}

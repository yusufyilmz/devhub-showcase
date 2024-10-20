'use client'

import { useEffect, useState } from 'react'
import { ChatMessageBox } from '../ChatMessageBox'
import type { ChatType } from '@shared/lib/types'
import { ChatInput } from '../ChatInput'
import CloseIcon from '@mui/icons-material/Close'
import { Button, IconButton } from '@mui/material'
import { copy } from '@shared/content'
import { TypingIndicator } from '../TypingIndicator'
import { useStore } from 'zustand'
import { chatStore, useChatMessages } from '../../../stores'

interface ChatPopupProps {
  type: ChatType
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

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#chat') {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

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
        <div className="w-full h-[32rem] bg-backgroundColor-chat rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out">
          <IconButton
            onClick={() => {
              toggleChat()
            }}
            className="absolute top-2 right-2 text-gray-500 focus:outline-none"
          >
            <CloseIcon className="h-4 w-4" />
          </IconButton>
          <div className="flex flex-col h-full  transition-all duration-700 transform scale-100">
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

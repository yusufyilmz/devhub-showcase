'use client'

import { useState } from 'react'
import { ChatMessageBox } from '../ChatMessageBox'
import { ChatMessage } from '@shared/lib'
import { ChatInput } from '../ChatInput'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { siteCopy } from '@shared/content'

interface ChatPopupProps {
  messages: ChatMessage[]
  // eslint-disable-next-line no-unused-vars
  handleSendMessage: (input: string) => void
}

export const ChatPopup: React.FC<ChatPopupProps> = ({
  messages,
  handleSendMessage
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {!isOpen && (
        <Button
          variant="contained"
          color="primary"
          className="rounded-lg shadow-2xl relative transition-all duration-300 ease-in-out focus:outline-none transform hover:scale-200"
          onClick={toggleChat}
        >
          {siteCopy.chat.placeholder}
        </Button>
      )}

      {isOpen && (
        <div className="w-full h-[32rem] bg-backgroundColor-card rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out">
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-500 hover:text-main-blue focus:outline-none"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
          <div className="flex flex-col h-full">
            <ChatMessageBox messages={messages} />
            <ChatInput handleSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  )
}

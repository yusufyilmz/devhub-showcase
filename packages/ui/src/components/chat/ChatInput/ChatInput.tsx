'use client'

import { useState } from 'react'
import { copy } from '@shared/content'
import { ChatType } from '@shared/lib/types'
import { Send } from '@mui/icons-material'
import { IconButton } from '@mui/material'

type ChatInputProps = {
  // eslint-disable-next-line no-unused-vars
  handleSendMessage: (input: string) => void
  botIsTyping?: boolean
  chatFinished?: boolean
  type: ChatType
}

export const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMessage,
  botIsTyping,
  type,
  chatFinished
}) => {
  const [input, setInput] = useState('')

  const handleSendButtonClick = () => {
    if (!input || botIsTyping || chatFinished) return
    handleSendMessage(input)
    setInput('')
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === 'Enter' &&
      !e.shiftKey &&
      input !== '' &&
      !botIsTyping &&
      !chatFinished
    ) {
      e.preventDefault()
      handleSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && !e.shiftKey && input !== '' && !chatFinished) {
      setInput(input.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        disabled={chatFinished}
        onChange={e => setInput(e.target.value)}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        className="flex-grow p-2 border rounded-lg"
        placeholder={copy.chat[chatFinished ? 'end' : type].placeholder}
      />
      <IconButton
        disabled={botIsTyping || chatFinished}
        type="submit"
        onClick={handleSendButtonClick}
        className="px-4 py-2 bg-main-black text-main-white rounded-lg hover:bg-gray-600"
      >
        <Send />
      </IconButton>
    </div>
  )
}

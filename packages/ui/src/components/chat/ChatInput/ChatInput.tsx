'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import { copy } from '@shared/content'

type ChatInputProps = {
  // eslint-disable-next-line no-unused-vars
  handleSendMessage: (input: string) => void
  botIsTyping?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  handleSendMessage,
  botIsTyping
}) => {
  const [input, setInput] = useState('')

  const handleSendButtonClick = () => {
    if (!input || botIsTyping) return
    handleSendMessage(input)
    setInput('')
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && !e.shiftKey && input !== '' && !botIsTyping) {
      e.preventDefault()
      handleSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && !e.shiftKey && input !== '') {
      setInput(input.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        className="flex-grow p-2 border rounded-lg"
        placeholder={copy.chat.placeholder}
      />
      <Button
        type="submit"
        variant="contained"
        onClick={handleSendButtonClick}
        className="px-4 py-2 bg-main-black text-main-white rounded-lg hover:bg-main-blue-dark"
      >
        Send
      </Button>
    </div>
  )
}

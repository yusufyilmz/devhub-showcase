'use client'

import { ChatMessageType, ChatRole } from '@shared/lib/types'
import { ChatMessageItem } from '../ChatMessageItem'
import { useRef, useEffect } from 'react'
import { useChatMessages } from '../../../stores'

interface ChatMessageBoxProps {
  botIsTyping?: boolean
  type: ChatMessageType
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  botIsTyping,
  type
}) => {
  const messages = useChatMessages(type)

  const chatListRef = useRef<HTMLDivElement>(null)

  const handleScrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }

  useEffect(() => handleScrollToBottom(), [messages, botIsTyping])

  return (
    <div className="h-full overflow-y-scroll mb-4 p-2" ref={chatListRef}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`mb-4 ${msg.role === ChatRole.User ? 'text-right' : 'text-left'}`}
        >
          <ChatMessageItem message={msg} />
        </div>
      ))}
    </div>
  )
}

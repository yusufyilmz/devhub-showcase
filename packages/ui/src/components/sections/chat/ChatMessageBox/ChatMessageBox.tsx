'use client'

import { ChatRole, type ChatType } from '@shared/lib/types'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { useChatMessages } from '../../../../stores'
import { ChatMessageItem } from '../ChatMessageItem'

interface ChatMessageBoxProps {
  botIsTyping?: boolean
  type: ChatType
}

export const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({
  botIsTyping,
  type
}) => {
  const messages = useChatMessages(type)

  const chatListRef = useRef<HTMLDivElement>(null)

  const contentKey = `${messages.length}:${Boolean(botIsTyping)}`
  useEffect(() => {
    if (!contentKey) return
    const element = chatListRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [contentKey])

  return (
    <div
      className="flex flex-col flex-1 overflow-y-auto p-4 gap-2"
      ref={chatListRef}
    >
      {messages.map((msg) => (
        <div
          key={`${msg.timestamp}:${msg.role}:${msg.content}`}
          className={`mb-4 ${msg.role === ChatRole.User ? 'text-right' : 'text-left'}`}
        >
          <ChatMessageItem message={msg} />
        </div>
      ))}
    </div>
  )
}

'use client'

import React from 'react'
import { chatStore } from '../../../../stores'
import { ChatMessage, ChatType } from '@shared/lib/types'
import { useStore } from 'zustand'
import { ChatPopupContainer } from '../ChatPopupContainer'
import { useState } from 'react'
import { IconButton, ChatIcon, ReferralIcon } from '../../../../components'

type ChatSectionProps = {
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string
  ) => Promise<ChatMessage>
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  handleSendMessage
}) => {
  const [type, setType] = useState<ChatType>('cv')
  const [isOpen, setIsOpen] = useState(false)
  const resetChat = useStore(chatStore, state => state.resetChat)

  const closeChat = (chatFinished: boolean) => {
    setIsOpen(!isOpen)

    if (chatFinished) {
      resetChat(type)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-[200]">
        <IconButton
          className="icon-button"
          aria-label={'Resume Chat'}
          onClick={() => {
            setType('cv')
            setIsOpen(!isOpen)
          }}
        >
          <ChatIcon fontSize="xlarge" />
        </IconButton>
        <IconButton
          className="icon-button"
          aria-label={'Referral Chat'}
          onClick={() => {
            setType('referral')
            setIsOpen(!isOpen)
          }}
        >
          <ReferralIcon fontSize="xlarge" />
        </IconButton>
      </div>
      {isOpen && (
        <ChatPopupContainer
          type={type}
          handleSendMessage={handleSendMessage}
          closeChat={closeChat}
        />
      )}
    </>
  )
}

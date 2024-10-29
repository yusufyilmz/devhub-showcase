'use client'

import { chatStore } from '../../../../stores'
import { ChatMessage, ChatType } from '@shared/lib/types'
import { useStore } from 'zustand'
import { ChatPopupContainer } from '../ChatPopupContainer'
import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import RecommendIcon from '@mui/icons-material/Recommend'

type ChatSectionProps = {
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string
  ) => Promise<ChatMessage>
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  handleSendMessage
}): JSX.Element => {
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
      <Box className="fixed bottom-4 right-4 flex flex-col z-[200]">
        <IconButton
          className="icon-button"
          size="large"
          color="primary"
          aria-label={'CV Chat'}
          onClick={() => {
            setType('cv')
            setIsOpen(!isOpen)
          }}
        >
          <QuestionAnswerIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="icon-button"
          color="primary"
          aria-label={'Referral Chat'}
          onClick={() => {
            setType('referral')
            setIsOpen(!isOpen)
          }}
        >
          <RecommendIcon fontSize="large" />
        </IconButton>
      </Box>
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

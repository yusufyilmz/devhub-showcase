import { create, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { CHAT_STORAGE_NAME } from '../constants/stores'
import { ChatMessage, ChatMessageType } from '@shared/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { copy } from '@shared/content'

export type ChatState = {
  chatMessages: ChatMessage[]
  messages: ChatMessage[]
  referralMessages: ChatMessage[]
  sessionId: string
}

type ChatActions = ChatState & {
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: ChatMessage) => void
  resetChat: (type: ChatMessageType) => void
}

type ChatStore = ChatState & ChatActions

export const chatStore = create<ChatStore>()(
  persist(
    set => ({
      sessionId: uuidv4(),
      referralMessages: [
        {
          ...copy.chatMessages.welcomeMessage.referral
        }
      ],
      chatMessages: [
        {
          ...copy.chatMessages.welcomeMessage.cv
        }
      ],
      messages: [],
      addMessage: message =>
        set(state =>
          message.type === 'referral'
            ? {
                referralMessages: [
                  ...state.referralMessages,
                  {
                    ...message
                  }
                ]
              }
            : {
                chatMessages: [
                  ...state.chatMessages,
                  {
                    ...message
                  }
                ]
              }
        ),
      resetChat: (type: ChatMessageType) => {
        set(
          type === 'referral'
            ? {
                referralMessages: [
                  {
                    ...copy.chatMessages.welcomeMessage.referral
                  }
                ]
              }
            : {
                chatMessages: [
                  {
                    ...copy.chatMessages.welcomeMessage.cv
                  }
                ]
              }
        )
      }
    }),
    {
      name: CHAT_STORAGE_NAME
    }
  )
)

export const useChatMessages = (type: string) =>
  useStore(
    chatStore,
    type === 'referral'
      ? state => state.referralMessages
      : state => state.chatMessages
  )
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CHAT_STORAGE_NAME } from '../constants/stores'
import { ChatMessage } from '@shared/lib'
import { copy } from '@shared/content'

export type ChatState = {
  messages: ChatMessage[]
}

type ChatActions = ChatState & {
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: ChatMessage) => void
  resetChat: () => void
}

type ChatStore = ChatState & ChatActions

export const chatStore = create<ChatStore>()(
  persist(
    set => ({
      messages: [
        {
          ...copy.chatMessages.welcomeMessage,
          timestamp: Date.now()
        }
      ],

      addMessage: message =>
        set(state => ({
          messages: [...state.messages, message]
        })),

      resetChat: () =>
        set({
          messages: [
            {
              ...copy.chatMessages.welcomeMessage,
            }
          ]
        })
    }),
    {
      name: CHAT_STORAGE_NAME
    }
  )
)

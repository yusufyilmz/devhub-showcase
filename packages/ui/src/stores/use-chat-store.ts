import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CHAT_STORAGE_NAME } from '../constants/stores'
import { ChatMessage } from '@shared/lib'
import { WELCOME_MESSAGE } from '@shared/chat'

interface ChatState {
  messages: ChatMessage[]
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: ChatMessage) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    set => ({
      messages: [
        {
          ...WELCOME_MESSAGE,
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
              ...WELCOME_MESSAGE
            }
          ]
        })
    }),
    {
      name: CHAT_STORAGE_NAME
    }
  )
)

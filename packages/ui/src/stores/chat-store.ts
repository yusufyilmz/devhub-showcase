import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CHAT_STORAGE_NAME } from '../constants/stores'
import { ChatMessage, ChatMessageType } from '@shared/lib/types'
import { v4 as uuidv4 } from 'uuid'

export type ChatState = {
  messages: ChatMessage[]
  referralMessages: ChatMessage[]
  sessionId: string
}

type ChatActions = ChatState & {
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: ChatMessage) => void
  getMessages: (type: ChatMessageType) => ChatMessage[]
  resetChat: (type: ChatMessageType) => void
}

type ChatStore = ChatState & ChatActions

export const chatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessionId: uuidv4(),
      referralMessages: [],
      messages: [],
      getMessages: type => {
        return type === 'referral' ? get().referralMessages : get().messages
      },
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
                messages: [
                  ...state.messages,
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
                referralMessages: []
              }
            : {
                messages: []
              }
        )
      }
    }),
    {
      name: CHAT_STORAGE_NAME
    }
  )
)

import type { ChatMessage, ChatType } from "@shared/lib/types";
import { v4 as uuidv4 } from "uuid";
import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

import { cvWelcomeMessage, referralWelcomeMessage } from "../constants/messages";
import { CHAT_STORAGE_NAME } from "../constants/stores";

export type ChatState = {
  chatMessages: ChatMessage[];
  messages: ChatMessage[];
  referralMessages: ChatMessage[];
  sessionId: string;
};

type ChatActions = ChatState & {
  addMessage: (message: ChatMessage) => void;
  resetChat: (type: ChatType) => void;
};

type ChatStore = ChatState & ChatActions;

export const chatStore = create<ChatStore>()(
  persist(
    (set) => ({
      addMessage: (message) =>
        set((state) =>
          message.type === "referral"
            ? {
                referralMessages: [
                  ...state.referralMessages,
                  {
                    ...message,
                  },
                ],
              }
            : {
                chatMessages: [
                  ...state.chatMessages,
                  {
                    ...message,
                  },
                ],
              },
        ),
      chatMessages: [
        {
          ...cvWelcomeMessage,
        },
      ],
      messages: [],
      referralMessages: [
        {
          ...referralWelcomeMessage,
        },
      ],
      resetChat: (type: ChatType) => {
        set(
          type === "referral"
            ? {
                referralMessages: [
                  {
                    ...referralWelcomeMessage,
                  },
                ],
              }
            : {
                chatMessages: [
                  {
                    ...cvWelcomeMessage,
                  },
                ],
              },
        );
      },
      sessionId: uuidv4(),
    }),
    {
      name: CHAT_STORAGE_NAME,
    },
  ),
);

export const useChatMessages = (type: string) =>
  useStore(
    chatStore,
    type === "referral" ? (state) => state.referralMessages : (state) => state.chatMessages,
  );

export const useAddMessage = () => useStore(chatStore, (state) => state.addMessage);

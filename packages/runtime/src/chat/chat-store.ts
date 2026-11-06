"use client";

import { createContext, useContext } from "react";

import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

import { type ChatMessage, ChatRole, type ChatType } from "@shared/lib/types";

import { chatStorage } from "../storage/chatStorage";

export type ChatIdentity = { id: string; revision: number; name: string };
export type ChatState = {
  chatMessages: ChatMessage[];
  referralMessages: ChatMessage[];
  sessionId: string;
};
export type ChatStoreState = ChatState & {
  addMessage: (message: ChatMessage) => void;
  resetChat: (type: ChatType) => void;
};
export function createChatStore(identity: ChatIdentity) {
  const welcome = (type: ChatType): ChatMessage => ({
    category: "greeting",
    content:
      type === "cv"
        ? `Ask about ${identity.name}’s published experience, projects and skills.`
        : `Share your professional feedback for ${identity.name}.`,
    role: ChatRole.System,
    title: `${identity.name}’s ${type === "cv" ? "portfolio" : "referral"} assistant`,
    type,
  });
  return createStore<ChatStoreState>()(
    persist(
      (set) => ({
        addMessage: (message) =>
          set((state) =>
            message.type === "referral"
              ? {
                  referralMessages: [...state.referralMessages, message].slice(-20),
                }
              : { chatMessages: [...state.chatMessages, message].slice(-20) },
          ),
        chatMessages: [welcome("cv")],
        referralMessages: [welcome("referral")],
        resetChat: (type) =>
          set(
            type === "referral"
              ? { referralMessages: [welcome(type)] }
              : { chatMessages: [welcome(type)] },
          ),
        sessionId: crypto.randomUUID(),
      }),
      chatStorage.persistence<ChatStoreState>(identity),
    ),
  );
}
export const ChatContext = createContext<ReturnType<typeof createChatStore> | null>(null);

export function useChatState<T>(selector: (state: ChatStoreState) => T) {
  const store = useContext(ChatContext);
  if (!store) throw new Error("A portfolio chat provider is required.");
  return useStore(store, selector);
}

export const useChatMessages = (type: string) =>
  useChatState((state) => (type === "referral" ? state.referralMessages : state.chatMessages));
export const useAddMessage = () => useChatState((state) => state.addMessage);

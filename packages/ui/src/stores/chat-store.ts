"use client";
import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { type ChatMessage, ChatRole, type ChatType } from "@shared/lib/types";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CHAT_STORAGE_NAME } from "../constants/stores";

export type ChatIdentity = { id: string; revision: number; name: string };
export type ChatState = {
  chatMessages: ChatMessage[];
  referralMessages: ChatMessage[];
  sessionId: string;
};
type ChatStoreState = ChatState & {
  addMessage: (message: ChatMessage) => void;
  resetChat: (type: ChatType) => void;
};
export const portfolioChatStorageKey = (identity: ChatIdentity) =>
  `${CHAT_STORAGE_NAME}:${encodeURIComponent(identity.id)}:${identity.revision}`;
export function createPortfolioChatStore(identity: ChatIdentity) {
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
              ? { referralMessages: [...state.referralMessages, message].slice(-20) }
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
      {
        name: portfolioChatStorageKey(identity),
        skipHydration: true,
        storage: createJSONStorage(() => window.sessionStorage),
        version: 1,
      },
    ),
  );
}
const ChatContext = createContext<ReturnType<typeof createPortfolioChatStore> | null>(null);
export function PortfolioChatProvider(props: { identity: ChatIdentity; children: ReactNode }) {
  return createElement(PortfolioChatScope, {
    ...props,
    key: portfolioChatStorageKey(props.identity),
  });
}
function PortfolioChatScope({
  identity,
  children,
}: {
  identity: ChatIdentity;
  children: ReactNode;
}) {
  const [store] = useState(() => createPortfolioChatStore(identity));
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);
  return createElement(ChatContext.Provider, { value: store }, children);
}
export function usePortfolioChatState<T>(selector: (state: ChatStoreState) => T) {
  const store = useContext(ChatContext);
  if (!store) throw new Error("A portfolio chat provider is required.");
  return useStore(store, selector);
}
export const useChatMessages = (type: string) =>
  usePortfolioChatState((state) =>
    type === "referral" ? state.referralMessages : state.chatMessages,
  );
export const useAddMessage = () => usePortfolioChatState((state) => state.addMessage);

"use client";

import { useEffect, useId, useState } from "react";

import { type ChatMessage, ChatRole, type ChatType } from "@shared/lib/types";
import { useChatMessages, useChatState } from "@shared/runtime/chat";

import { ChatPanel } from "../chat/assistant-chat/chat-panel";

interface ChatPopupProps {
  closeChat: (chatFinished: boolean) => void;
  handleSendMessage: (input: ChatMessage, sessionId: string) => Promise<ChatMessage>;
  type: ChatType;
}

export const ChatPopupContainer = ({ handleSendMessage, type, closeChat }: ChatPopupProps) => {
  const sessionId = useChatState((state) => state.sessionId);
  const addMessage = useChatState((state) => state.addMessage);
  const messages = useChatMessages(type);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatFinished, setIsChatFinished] = useState(false);
  const titleId = useId();
  const inputId = useId();

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping || isChatFinished) return;

    setIsTyping(true);
    setDraft("");

    const lastMessage = messages.filter((message) => message.type === type).pop();
    const newMessage = {
      category: lastMessage?.category,
      content: input,
      role: ChatRole.User,
      timestamp: Date.now(),
      type,
    } as ChatMessage;

    addMessage(newMessage);

    try {
      const response = await handleSendMessage(newMessage, sessionId);
      addMessage(response);
    } catch (e) {
      const error = e as Error;
      addMessage({
        category: "error",
        content: error.message || "The assistant is unavailable. Please try later.",
        role: ChatRole.System,
        timestamp: Date.now(),
        type,
      } as ChatMessage);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1]?.category === "end") {
      setIsChatFinished(true);
    }
  }, [messages]);

  return (
    <div className="fixed bottom-0 right-0 z-[250] md:right-4">
      <div
        aria-labelledby={titleId}
        className="chat-panel relative h-[100vh] w-[100vw] bg-background p-6 shadow-2xl md:h-[32rem] md:w-96 md:rounded-lg"
        role="dialog"
      >
        <ChatPanel
          busy={isTyping}
          closeLabel="Close chat"
          emptyDescription="Start the conversation."
          inputId={inputId}
          inputLabel={isChatFinished ? "Conversation ended" : "Your message"}
          messages={messages.map((message) => ({
            id: `${message.timestamp ?? ""}:${message.role}:${message.content}`,
            role:
              message.role === ChatRole.User
                ? "user"
                : message.role === ChatRole.System
                  ? "system"
                  : "assistant",
            text: message.title ? `${message.title}\n${message.content}` : message.content,
          }))}
          onClose={() => closeChat(isChatFinished)}
          onSubmit={handleSendMessageAction}
          onValueChange={setDraft}
          sendLabel="Send"
          title={type === "cv" ? "Portfolio assistant" : "Referral assistant"}
          titleId={titleId}
          value={draft}
        />
      </div>
    </div>
  );
};

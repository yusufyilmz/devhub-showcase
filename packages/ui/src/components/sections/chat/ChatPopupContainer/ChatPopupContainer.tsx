"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { type ChatMessage, ChatRole, type ChatType } from "@shared/lib/types";

import { failureMessage } from "../../../../constants/messages";
import { useChatMessages, usePortfolioChatState } from "../../../../stores/chat-store";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { CloseIcon } from "../../../ui/Icons/Icons";
import { ChatInput } from "../ChatInput/ChatInput";
import { ChatMessageBox } from "../ChatMessageBox/ChatMessageBox";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

interface ChatPopupProps {
  className?: string;
  closeChat: (chatFinished: boolean) => void;
  handleSendMessage: (input: ChatMessage, sessionId: string) => Promise<ChatMessage>;
  isTyping?: boolean;
  type: ChatType;
}

export const ChatPopupContainer: React.FC<ChatPopupProps> = ({
  handleSendMessage,
  type,
  closeChat,
}) => {
  const sessionId = usePortfolioChatState((state) => state.sessionId);
  const addMessage = usePortfolioChatState((state) => state.addMessage);
  const messages = useChatMessages(type);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatFinished, setIsChatFinished] = useState(false);

  const handleSendMessageAction = async (input: string): Promise<void> => {
    if (!input || isTyping) return;

    setIsTyping(true);

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
      const message = (
        error?.message
          ? {
              content: error?.message,
              role: ChatRole.System,
              timestamp: Date.now(),
              type,
            }
          : failureMessage
      ) as ChatMessage;

      addMessage(message);
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
    <div className="fixed  bottom-0 right-0 md:right-4 z-[250]">
      <div
        aria-label="Portfolio assistant"
        className="chat-panel w-[100vw] h-[100vh] md:w-full md:h-[32rem] bottom-0 bg-backgroundColor-chat md:rounded-lg shadow-2xl p-6 relative transition-all duration-300 ease-in-out"
        role="dialog"
      >
        <IconButton
          aria-label="Close chat"
          className="icon-button absolute top-2 right-2"
          onClick={() => {
            closeChat(isChatFinished);
          }}
        >
          <CloseIcon className="text-main-secondary" fontSize="small" />
        </IconButton>
        <div className="flex flex-col h-full  transition-all duration-700 transform scale-100">
          <ChatMessageBox botIsTyping={isTyping} type={type} />
          {isTyping && <TypingIndicator />}
          <ChatInput
            botIsTyping={isTyping}
            chatFinished={isChatFinished}
            handleSendMessage={handleSendMessageAction}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

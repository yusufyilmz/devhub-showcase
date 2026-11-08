"use client";
import type { ComponentProps } from "react";

import { EngineerPortfolioView } from "@shared/assistant/engineer-portfolio";
import type { ChatMessage } from "@shared/lib/types";

import { handleSendMessageAction } from "../actions";

export function EngineerPortfolio(
  props: Omit<ComponentProps<typeof EngineerPortfolioView>, "handleSendMessage">,
) {
  const username = props.chatIdentity?.username;
  return (
    <EngineerPortfolioView
      {...props}
      handleSendMessage={async (message, sessionId, onDelta) => {
        if (!username) return Promise.reject(new Error("Chat is unavailable"));
        if (message.type === "cv" && onDelta) {
          const { streamPortfolioAnswer } = await import("@shared/assistant/stream-client");
          const content = await streamPortfolioAnswer(
            username,
            sessionId,
            message.content,
            onDelta,
          );
          return {
            ...message,
            category: "unknown",
            content,
            role: "assistant" as ChatMessage["role"],
            timestamp: Date.now(),
          };
        }
        return handleSendMessageAction(username, message, sessionId);
      }}
    />
  );
}

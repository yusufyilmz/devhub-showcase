"use client";

import "@shared/ui/portfolio-chat.css";

import type { ComponentProps } from "react";

import { PortfolioChat } from "../portfolio-chat/portfolio-chat-dialog";

export function PremiumWidgetView({
  id,
  name,
  revision,
  sources,
  handleSendMessage,
}: {
  sources?: { label: string; href: string }[];
  id: string;
  name: string;
  revision: number;
  handleSendMessage: (message: string, sessionId: string) => Promise<string>;
}) {
  return (
    <PortfolioChat
      identity={id}
      name={name}
      revision={revision}
      send={async (message: string, sessionId: string, signal: AbortSignal) => {
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        const answer = await handleSendMessage(message, sessionId);
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
        return answer;
      }}
      sources={sources}
    />
  );
}

export function PremiumWidget(
  props: Omit<ComponentProps<typeof PremiumWidgetView>, "handleSendMessage"> & {
    username: string;
    handleSendMessage: (
      username: string,
      message: string,
      sessionId: string,
      requestId: string,
    ) => Promise<string>;
  },
) {
  const { username, handleSendMessage, ...rest } = props;
  return (
    <PremiumWidgetView
      {...rest}
      handleSendMessage={(message, sessionId) =>
        handleSendMessage(username, message, sessionId, crypto.randomUUID())
      }
    />
  );
}

"use client";

import type React from "react";
import { useState } from "react";

import type { ChatMessage, ChatType } from "@shared/lib/types";
import { type ChatIdentity, useChatState } from "@shared/runtime/chat";
import { AgentCompanion } from "@shared/ui/agent-companion";
import { IconButton } from "@shared/ui/icon-button";
import { ChatIcon, ReferralIcon } from "@shared/ui/icons";
import { PortfolioChatProvider } from "@shared/ui/providers";

import { ChatPopupContainer } from "./ChatPopupContainer";

type ChatSectionProps = {
  portfolioChatHref?: string;
  sources?: { label: string; href: string }[];
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string,
    onDelta?: (text: string) => void,
  ) => Promise<ChatMessage>;
};

export const ChatSection = ({
  identity,
  leading,
  ...props
}: ChatSectionProps & { identity: ChatIdentity; leading?: React.ReactNode }) => (
  <PortfolioChatProvider identity={identity} key={`${identity.id}:${identity.revision}`}>
    <ChatControls {...props} leading={leading} />
  </PortfolioChatProvider>
);
const ChatControls: React.FC<ChatSectionProps & { leading?: React.ReactNode }> = ({
  handleSendMessage,
  portfolioChatHref,
  sources,
  leading,
}) => {
  const [type, setType] = useState<ChatType>("cv");
  const [isOpen, setIsOpen] = useState(false);
  const resetChat = useChatState((state) => state.resetChat);

  const closeChat = (chatFinished: boolean) => {
    setIsOpen(!isOpen);

    if (chatFinished) {
      resetChat(type);
    }
  };

  return (
    <>
      {portfolioChatHref && !isOpen && (
        <AgentCompanion
          agent="portfolio"
          className="portfolio-agent-companion"
          href={portfolioChatHref}
          label="Portfolio assistant"
        />
      )}
      <div className="fixed bottom-6 right-4 flex flex-col items-end gap-3 z-[200] sm:right-8">
        {leading}
        {!portfolioChatHref && (
          <IconButton
            aria-label={"Resume Chat"}
            className="rounded-full"
            onClick={() => {
              setType("cv");
              setIsOpen(!isOpen);
            }}
            size="lg"
            surface="portfolio"
            variant="outline"
          >
            <ChatIcon fontSize="medium" />
          </IconButton>
        )}
        <IconButton
          aria-label={"Referral Chat"}
          className="rounded-full"
          onClick={() => {
            setType("referral");
            setIsOpen(!isOpen);
          }}
          size="lg"
          surface="portfolio"
          variant="outline"
        >
          <ReferralIcon fontSize="medium" />
        </IconButton>
      </div>
      {isOpen && (
        <ChatPopupContainer
          closeChat={closeChat}
          handleSendMessage={handleSendMessage}
          sources={sources}
          type={type}
        />
      )}
    </>
  );
};

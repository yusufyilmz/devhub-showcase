"use client";

import type React from "react";
import { useState } from "react";

import type { ChatMessage, ChatType } from "@shared/lib/types";
import { IconButton } from "@shared/ui/icon-button";
import { ChatIcon, ReferralIcon } from "@shared/ui/icons";
import { type ChatIdentity, PortfolioChatProvider, usePortfolioChatState } from "@shared/ui/stores";

import { ChatPopupContainer } from "./ChatPopupContainer";

type ChatSectionProps = {
  handleSendMessage: (input: ChatMessage, sessionId: string) => Promise<ChatMessage>;
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
  leading,
}) => {
  const [type, setType] = useState<ChatType>("cv");
  const [isOpen, setIsOpen] = useState(false);
  const resetChat = usePortfolioChatState((state) => state.resetChat);

  const closeChat = (chatFinished: boolean) => {
    setIsOpen(!isOpen);

    if (chatFinished) {
      resetChat(type);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-[200] sm:right-8">
        {leading}
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
          type={type}
        />
      )}
    </>
  );
};

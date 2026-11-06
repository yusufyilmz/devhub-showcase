"use client";

import type { ComponentProps, ReactNode } from "react";

import { ChatSection } from "@shared/assistant/chat-section";
import { type PortfolioProfile, selectPortfolioContent } from "@shared/config";
import { publicChatSources } from "@shared/lib/profiles";
import type { ChatMessage } from "@shared/lib/types";
import { getPortfolioResources } from "@shared/services/portfolio";
import { EngineerPage } from "@shared/ui/portfolio";
import type { ReferralSection } from "@shared/ui/sections";

import { handleSendMessageAction } from "../../../app/actions";

interface EngineerPortfolioProps {
  chatIdentity?: {
    id: string;
    username: string;
    name: string;
    revision: number;
  };
  extras?: boolean;
  handleSendMessage: (
    input: ChatMessage,
    sessionId: string,
    onDelta?: (text: string) => void,
  ) => Promise<ChatMessage>;
  ownerLink?: ReactNode;
  profile: PortfolioProfile;
  referrals?: ComponentProps<typeof ReferralSection>["referrals"];
}

export function EngineerPortfolioView({
  profile,
  ownerLink,
  referrals = [],
  extras = false,
  chatIdentity,
  handleSendMessage,
}: EngineerPortfolioProps) {
  const canonicalProfile = profile;
  profile = selectPortfolioContent(profile);
  const chat =
    extras && chatIdentity ? (
      <ChatSection
        handleSendMessage={handleSendMessage}
        identity={chatIdentity}
        leading={ownerLink}
        portfolioChatHref={`/${encodeURIComponent(chatIdentity.username)}/chat`}
        sources={publicChatSources({
          id: chatIdentity.id,
          isPublic: true,
          profile: canonicalProfile,
          revision: chatIdentity.revision,
          updatedAt: "",
          username: chatIdentity.username,
        })}
      />
    ) : null;
  return (
    <EngineerPage
      chat={chat}
      extras={extras}
      ownerLink={chat ? undefined : ownerLink}
      profile={profile}
      referrals={referrals}
      resources={getPortfolioResources(profile)}
      sourceProfile={canonicalProfile}
    />
  );
}

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
          const { streamPortfolioAnswer } = await import("@/features/chat/stream-client");
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

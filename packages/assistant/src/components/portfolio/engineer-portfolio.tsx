"use client";

import type { ComponentProps, ReactNode } from "react";

import { type PortfolioProfile, selectPortfolioContent } from "@shared/config";
import { getPortfolioResources } from "@shared/lib/portfolio";
import { publicChatSources } from "@shared/lib/profiles";
import type { ChatMessage } from "@shared/lib/types";

import { ChatSection } from "../chat/chat-section/index";
import type { ReferralSection } from "../sections/index";
import { type ArrangePortfolioSections, EngineerPage } from "./index";

interface EngineerPortfolioProps {
  arrange?: ArrangePortfolioSections;
  chatIdentity?: {
    id: string;
    username: string;
    name: string;
    revision: number;
  };
  extras?: boolean;
  featured?: boolean;
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
  arrange,
  profile,
  ownerLink,
  referrals = [],
  extras = false,
  featured = extras,
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
      arrange={arrange}
      chat={chat}
      extras={extras}
      featured={featured}
      ownerLink={chat ? undefined : ownerLink}
      profile={profile}
      referrals={referrals}
      resources={getPortfolioResources(profile)}
      sourceProfile={canonicalProfile}
    />
  );
}

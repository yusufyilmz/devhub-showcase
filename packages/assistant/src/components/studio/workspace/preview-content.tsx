"use client";

import type { ReactNode } from "react";

import { type PortfolioEntryId, type PortfolioProfile, projectPublicProfile } from "@shared/config";

import { EngineerPortfolioView } from "../../portfolio/engineer-portfolio";

export type PublishedPortfolioLayoutProps = {
  arrange?: {
    disabled?: boolean;
    onChange: (visibleOrder: PortfolioEntryId[]) => void;
  };
  profile: PortfolioProfile;
  username: string;
};

export function PreviewContent({
  arrange,
  featured,
  profile,
  renderPortfolio,
  username,
}: {
  arrange?: PublishedPortfolioLayoutProps["arrange"];
  featured?: boolean;
  profile: PortfolioProfile;
  renderPortfolio?: (props: PublishedPortfolioLayoutProps) => ReactNode;
  username: string;
}) {
  profile = projectPublicProfile(profile, "website");
  if (!profile.portfolioType || profile.portfolioType === "engineer")
    return (
      <EngineerPortfolioView
        arrange={arrange}
        featured={featured}
        handleSendMessage={async () => {
          throw new Error("Chat is disabled in draft preview");
        }}
        profile={profile}
      />
    );
  return renderPortfolio?.({
    arrange,
    profile,
    username: username || "preview",
  });
}

"use client";
import type { PortfolioProfile } from "@shared/config";

import { PortfolioLayout } from "../portfolio/sections/portfolio-layout";
import { EngineerPortfolioView } from "../portfolio/variants/engineer-portfolio";

export function PreviewContent({
  profile,
  username,
}: {
  profile: PortfolioProfile;
  username: string;
}) {
  if (!profile.portfolioType || profile.portfolioType === "engineer")
    return (
      <EngineerPortfolioView
        handleSendMessage={async () => {
          throw new Error("Chat is disabled in draft preview");
        }}
        profile={profile}
      />
    );
  return <PortfolioLayout profile={profile} username={username || "preview"} />;
}

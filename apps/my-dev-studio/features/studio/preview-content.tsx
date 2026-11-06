"use client";
import { type PortfolioProfile, projectPublicProfile } from "@shared/config";
import { PortfolioLayout } from "@shared/ui/portfolio";

import { EngineerPortfolioView } from "../portfolio/variants/engineer-portfolio";

export function PreviewContent({
  profile,
  username,
}: {
  profile: PortfolioProfile;
  username: string;
}) {
  profile = projectPublicProfile(profile, "website");
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

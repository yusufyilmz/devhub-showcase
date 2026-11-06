"use client";
import { type PortfolioProfile, projectPublicProfile } from "@shared/config";
import { type ArrangePortfolioSections, PortfolioLayout } from "@shared/ui/portfolio";

import { EngineerPortfolioView } from "../portfolio/variants/engineer-portfolio";

export function PreviewContent({
  arrange,
  featured,
  profile,
  username,
}: {
  arrange?: ArrangePortfolioSections;
  featured?: boolean;
  profile: PortfolioProfile;
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
  return <PortfolioLayout arrange={arrange} profile={profile} username={username || "preview"} />;
}

"use client";
import type { PortfolioProfile } from "@shared/config";

import { EngineerPortfolioView } from "./EngineerPortfolioView";

export function ExamplePortfolioPreview({ profile }: { profile: PortfolioProfile }) {
  return (
    <EngineerPortfolioView
      handleSendMessage={async () => {
        throw new Error("Chat is disabled in example previews");
      }}
      profile={profile}
    />
  );
}

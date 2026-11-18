import type { Metadata } from "next";

import { AgentCompanion } from "@shared/assistant/agent-companion";
import { portfolioGuide } from "@shared/assistant/companion-guides";
import { createPortfolioMetadata } from "@shared/assistant/portfolio-metadata";

import { premiumChatAvailable } from "@/services/chat/get-access";
import { EngineerPortfolio } from "@/services/portfolio/engineer-portfolio";
import { getUsernameProfile } from "@/services/portfolio/get-profile";
import { loadPageResources } from "@/services/portfolio/get-resources";
import { platformSeo } from "@/services/site/get-site";
import { PortfolioLayout } from "@/views/published/PortfolioLayout";
import { OwnerEditLink } from "@/views/user/OwnerEditLink";

export const maxDuration = 60;

type Props = { params: Promise<{ username: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getUsernameProfile((await params).username);
  return createPortfolioMetadata(profile, (await params).username, platformSeo);
}
export default async function PublicCvPage({ params }: Props) {
  const { username } = await params;
  const { profile: saved, id, revision } = await getUsernameProfile(username);
  const original = id === "main";
  const engineer = !saved.portfolioType || saved.portfolioType === "engineer";
  const mainPortfolioChat = original && engineer && saved.publicationVisibility !== "password";
  const canChat =
    !mainPortfolioChat &&
    id &&
    saved.publicationVisibility !== "password" &&
    (await premiumChatAvailable(id));
  const widget = mainPortfolioChat ? null : (
    <AgentCompanion
      agent="portfolio"
      guide={portfolioGuide}
      href={canChat ? `/${encodeURIComponent(username)}/chat` : "#main-content"}
      label={canChat ? `Ask about ${saved.name}` : "Explore this portfolio"}
    />
  );
  if (!engineer)
    return (
      <>
        {widget}
        <OwnerEditLink offset={Boolean(widget)} username={username} />
        <PortfolioLayout profile={saved} username={username} />
      </>
    );
  const referrals = original ? (await loadPageResources()).referrals : [];
  const profile = {
    ...saved,
    cvUrl: !saved.cvUrl || saved.cvUrl === "/cv.pdf" ? `/${username}/cv.pdf` : saved.cvUrl,
  };
  return (
    <>
      {widget}
      <EngineerPortfolio
        chatIdentity={
          mainPortfolioChat && id ? { id, name: saved.name, revision, username } : undefined
        }
        extras={original}
        ownerLink={
          <OwnerEditLink floating={!original} offset={Boolean(widget)} username={username} />
        }
        profile={profile}
        referrals={referrals}
      />
    </>
  );
}

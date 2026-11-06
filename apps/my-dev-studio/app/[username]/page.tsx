import "@shared/ui/portfolio-chat.css";

import type { Metadata } from "next";

import { AgentCompanion } from "@shared/ui/agent-companion";
import { PortfolioLayout } from "@shared/ui/portfolio";

import { OwnerEditLink } from "@/features/admin/owner-edit-link";
import { premiumChatAvailable } from "@/features/chat/premium-chat";
import { portfolioGuide } from "@/features/companion/guides";
import { portfolioMetadata } from "@/features/portfolio/portfolio-metadata";
import { loadPageResources } from "@/features/portfolio/portfolio-resources";
import { getUsernameProfile } from "@/features/portfolio/profiles/public-profile";
import { EngineerPortfolio } from "@/features/portfolio/variants/engineer-portfolio";

export const maxDuration = 60;

type Props = { params: Promise<{ username: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getUsernameProfile((await params).username);
  return portfolioMetadata(profile, (await params).username);
}
export default async function PublicCvPage({ params }: Props) {
  const { username } = await params;
  const { profile: saved, id, revision } = await getUsernameProfile(username);
  const original = id === "main";
  const engineer = !saved.portfolioType || saved.portfolioType === "engineer";
  const widget =
    id &&
    !(original && engineer) &&
    saved.publicationVisibility !== "password" &&
    (await premiumChatAvailable(id)) ? (
      <AgentCompanion
        agent="portfolio"
        guide={portfolioGuide}
        href={`/${encodeURIComponent(username)}/chat`}
        label={`Ask about ${saved.name}`}
      />
    ) : null;
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
          original && id && saved.publicationVisibility !== "password"
            ? { id, name: saved.name, revision, username }
            : undefined
        }
        extras={original}
        ownerLink={<OwnerEditLink floating={!original} username={username} />}
        profile={profile}
        referrals={referrals}
      />
    </>
  );
}

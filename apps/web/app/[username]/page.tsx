import type { Metadata } from "next";

import { OwnerEditLink } from "../../features/admin/owner-edit-link";
import { PremiumWidget } from "../../features/chat/premium-widget";
import { EngineerPortfolio } from "../../features/portfolio/engineer-portfolio";
import { PortfolioLayout } from "../../features/portfolio/portfolio-layout";
import { portfolioMetadata } from "../../lib/portfolio-metadata";
import { loadPageResources } from "../../lib/portfolio-resources";
import { premiumChatAvailable } from "../../lib/premium-chat";
import { getUsernameProfile } from "../../lib/public-profile";

export const maxDuration = 60;

type Props = { params: Promise<{ username: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await getUsernameProfile((await params).username);
  return portfolioMetadata(profile, (await params).username);
}
export default async function PublicCvPage({ params }: Props) {
  const { username } = await params;
  const { profile: saved, id, revision } = await getUsernameProfile(username);
  const widget =
    id && (await premiumChatAvailable(id)) ? (
      <PremiumWidget id={id} name={saved.name} revision={revision} username={username} />
    ) : null;
  if (saved.portfolioType && saved.portfolioType !== "engineer")
    return (
      <>
        {widget}
        <OwnerEditLink username={username} />
        <PortfolioLayout profile={saved} username={username} />
      </>
    );
  const original = id === "main";
  const referrals = original ? (await loadPageResources()).referrals : [];
  const profile = {
    ...saved,
    cvUrl: !saved.cvUrl || saved.cvUrl === "/cv.pdf" ? `/${username}/cv.pdf` : saved.cvUrl,
  };
  return (
    <>
      {widget}
      <EngineerPortfolio
        chatIdentity={original && id ? { id, name: saved.name, revision, username } : undefined}
        extras={original}
        ownerLink={<OwnerEditLink username={username} />}
        profile={profile}
        referrals={referrals}
      />
    </>
  );
}

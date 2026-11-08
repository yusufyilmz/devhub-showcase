import { notFound } from "next/navigation";

import { PortfolioVisitorChat } from "@shared/assistant/visitor-chat";
import { publicChatSources } from "@shared/lib/profiles";
import { readPublicProfileByUsername } from "@shared/lib/published-profile";

import { handlePremiumChatAction } from "../../actions";
import { premiumChatAvailable } from "./_access";

export const metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio assistant",
};

export default async function PortfolioChatPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const snapshot = await readPublicProfileByUsername(username);
  if (!snapshot?.id || !snapshot.isPublic || snapshot.profile.publicationVisibility === "password")
    notFound();
  const isMainPortfolio = snapshot.id === "main";
  if (!isMainPortfolio && !(await premiumChatAvailable(snapshot.id))) notFound();

  return (
    <PortfolioVisitorChat
      answerPremiumChat={handlePremiumChatAction}
      identity={{ id: snapshot.id, name: snapshot.profile.name, revision: snapshot.revision }}
      isMainPortfolio={isMainPortfolio}
      key={`${snapshot.id}:${snapshot.revision}`}
      sources={publicChatSources(snapshot)}
      username={username}
    />
  );
}

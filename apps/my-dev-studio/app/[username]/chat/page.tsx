import { notFound } from "next/navigation";

import { publicChatSources } from "@shared/lib/profiles";
import { readPublicProfileByUsername } from "@shared/services/published-profile";

import { PortfolioVisitorChat } from "@/features/chat/portfolio-visitor-chat";
import { premiumChatAvailable } from "@/features/chat/premium-chat";

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
  const legacy = snapshot.id === "main";
  if (!legacy && !(await premiumChatAvailable(snapshot.id))) notFound();

  return (
    <PortfolioVisitorChat
      identity={{ id: snapshot.id, name: snapshot.profile.name, revision: snapshot.revision }}
      key={`${snapshot.id}:${snapshot.revision}`}
      legacy={legacy}
      sources={publicChatSources(snapshot)}
      username={username}
    />
  );
}

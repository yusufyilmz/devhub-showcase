import type { PageAction } from "@shared/assistant/sections";

import { requirePortfolioAdmin } from "@/features/management/managed-portfolios";

import { getHomeAction } from "./_home-links";
import { ProfileMenu } from "./_profile-menu";
import { jobAlertConfig } from "./api/jobs/_config";

export async function getAccountMenu({
  action,
  protectDraft = false,
}: {
  action?: PageAction & { username?: string };
  protectDraft?: boolean;
}) {
  const session = action ?? (await getHomeAction());
  if (!session.signedIn) return null;
  const admin = await requirePortfolioAdmin().catch(() => null);
  return (
    <ProfileMenu
      canImportLinkedInAlerts={Boolean(jobAlertConfig())}
      canManagePortfolios={Boolean(admin)}
      initials={session.username?.slice(0, 2).toUpperCase() ?? "U"}
      protectDraft={protectDraft}
      studioHref={session.href}
      username={session.username}
    />
  );
}

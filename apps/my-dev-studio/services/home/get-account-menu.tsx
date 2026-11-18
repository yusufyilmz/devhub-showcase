import type { PageAction } from "@shared/ui/sections";

import { getHomeAction } from "@/services/home/get-home-links";
import { ProfileMenu } from "@/services/home/profile-menu";
import { jobAlertConfig } from "@/services/jobs/get-config";
import { requirePortfolioAdmin } from "@/services/management/get-portfolios";
import { trelloConfig } from "@/services/trello/get-config";

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
      canAccessTrello={Boolean(admin && trelloConfig())}
      canImportLinkedInAlerts={Boolean(jobAlertConfig())}
      canManagePortfolios={Boolean(admin)}
      initials={session.username?.slice(0, 2).toUpperCase() ?? "U"}
      protectDraft={protectDraft}
      studioHref={session.href}
      username={session.username}
    />
  );
}

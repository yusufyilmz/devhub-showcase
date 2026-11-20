import type { PageAction } from "@shared/ui/sections";

import { getHomeSession } from "@/services/home/get-home-links";
import { ProfileMenu } from "@/services/home/profile-menu";
import { jobAlertConfig } from "@/services/jobs/get-config";
import { portfolioAdminStatus } from "@/services/management/get-portfolios";
import { trelloConfig } from "@/services/trello/get-config";

export async function getAccountMenu({
  action,
  protectDraft = false,
}: {
  action?: PageAction & { username?: string };
  protectDraft?: boolean;
}) {
  // A guest action is enough to render no menu; avoid another identity lookup.
  if (action && !action.signedIn) return null;

  const home = await getHomeSession();
  const session = action ?? home.action;
  if (!session.signedIn || !home.action.signedIn) return null;

  const isAdmin = home.client ? await portfolioAdminStatus(home.client).catch(() => false) : false;
  return (
    <ProfileMenu
      canAccessTrello={Boolean(isAdmin && trelloConfig())}
      canImportLinkedInAlerts={Boolean(jobAlertConfig())}
      canManagePortfolios={isAdmin}
      initials={session.username?.slice(0, 2).toUpperCase() ?? "U"}
      protectDraft={protectDraft}
      studioHref={session.href}
      username={session.username}
    />
  );
}

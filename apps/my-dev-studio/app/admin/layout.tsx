import type { Metadata } from "next";
import { headers } from "next/headers";

import { StudioShell } from "@shared/assistant/portfolio";
import { StudioCompanion } from "@shared/assistant/studio-companion";
import { ThemeToggle } from "@shared/ui/theme";

import { getAccountMenu } from "../_account-menu";
import { getHomeAction } from "../_home-links";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio studio",
};
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-profile-path") ?? "";
  if (path === "/admin/chat") return children;
  const showCompanion =
    path === "/admin/billing" || path === "/admin/portfolios" || path.endsWith("/review");
  const action = await getHomeAction();
  return (
    <StudioShell
      contentId="admin-content"
      tools={
        <div className="admin-tools flex items-center gap-3">
          <ThemeToggle />
          {await getAccountMenu({ action, protectDraft: path.endsWith("/edit") })}
        </div>
      }
    >
      {children}
      {showCompanion && <StudioCompanion signedIn={action.signedIn} />}
    </StudioShell>
  );
}

import { StudioShell } from "@shared/assistant/portfolio";
import { ThemeToggle } from "@shared/ui/theme";

import { getAccountMenu } from "../_account-menu";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioShell
      contentId="main-content"
      tools={
        <div className="admin-tools flex items-center gap-3">
          <ThemeToggle />
          {await getAccountMenu({})}
        </div>
      }
    >
      {children}
    </StudioShell>
  );
}

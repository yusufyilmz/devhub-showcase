import type { Metadata } from "next";

import { StudioShell } from "@shared/components/studio";
import { ThemeToggle } from "@shared/ui/theme";

import { ManagementLink } from "@/features/management/management-link";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio studio",
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioShell
      brand={
        <>
          CV<span>.</span>
        </>
      }
      contentId="admin-content"
      title="PORTFOLIO STUDIO"
      tools={
        <div className="admin-tools">
          <ManagementLink />
          <ThemeToggle />
        </div>
      }
    >
      {children}
    </StudioShell>
  );
}

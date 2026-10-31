import { StudioShell } from "@shared/components/studio-shell";
import { ThemeToggle } from "@shared/ui/theme";
import type { Metadata } from "next";

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
        <>
          <ManagementLink />
          <ThemeToggle />
        </>
      }
    >
      {children}
    </StudioShell>
  );
}

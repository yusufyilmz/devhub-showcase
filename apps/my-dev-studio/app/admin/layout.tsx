import type { Metadata } from "next";
import { headers } from "next/headers";

import { ThemeToggle } from "@shared/ui/theme";

import { ManagementLink } from "@/features/management/management-link";
import { StudioShell } from "@/features/studio";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Portfolio studio",
};
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if ((await headers()).get("x-profile-path") === "/admin/chat") return children;
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

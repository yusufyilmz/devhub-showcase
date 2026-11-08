import { StudioShell } from "@shared/assistant/portfolio";
import { ThemeToggle } from "@shared/ui/theme";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioShell
      contentId="main-content"
      tools={
        <div className="admin-tools">
          <ThemeToggle />
        </div>
      }
    >
      {children}
    </StudioShell>
  );
}

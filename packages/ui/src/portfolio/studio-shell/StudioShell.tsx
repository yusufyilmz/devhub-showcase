import "../portfolio.css";

import type { ReactNode } from "react";

import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { Header } from "../../navigation/header";
import { HomeFooter } from "../../sections/home-section/footer";

export function StudioShell({
  children,
  contentId = "studio-content",
  tools,
}: {
  children: ReactNode;
  contentId?: string;
  tools?: ReactNode;
}) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href={`#${contentId}`}>
        Skip to content
      </a>
      <Header asChild>
        <header className="admin-masthead">
          <div className="admin-brand">
            <div className="admin-identity">
              <Brand />
              <span>Portfolio studio</span>
            </div>
            <nav aria-label="Studio navigation" className="admin-navigation">
              <Button href="/admin" variant="ghost">
                Workspace
              </Button>
              <Button href="/#examples" variant="ghost">
                Examples
              </Button>
              <Button href="/#questions" variant="ghost">
                Help
              </Button>
            </nav>
            {tools}
          </div>
        </header>
      </Header>
      {children}
      <HomeFooter action={{ href: "/admin", label: "Open studio", signedIn: true }} />
    </div>
  );
}

import "@shared/ui/components.css";

import type { ReactNode } from "react";

import { Brand } from "@shared/ui/brand";
import { Button } from "@shared/ui/button";
import { Header, SkipLink } from "@shared/ui/header";

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
    <div className="admin-shell [&_input:not([type=checkbox])]:w-full [&_input:not([type=checkbox])]:min-w-0 [&_input:not([type=checkbox])]:rounded-lg [&_input:not([type=checkbox])]:border [&_input:not([type=checkbox])]:border-border [&_input:not([type=checkbox])]:bg-[color-mix(in_srgb,var(--background)_70%,transparent)] [&_input:not([type=checkbox])]:px-[13px] [&_input:not([type=checkbox])]:py-[11px] [&_input:not([type=checkbox])]:font-[13px/1.7_var(--font-geist-sans),sans-serif] [&_input:not([type=checkbox])]:text-foreground [&_input:not([type=checkbox])]:outline-offset-1 [&_textarea]:min-h-[118px] [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-[color-mix(in_srgb,var(--background)_70%,transparent)] [&_textarea]:px-[13px] [&_textarea]:py-[11px] [&_textarea]:font-[13px/1.7_var(--font-geist-sans),sans-serif] [&_textarea]:text-foreground [&_textarea]:outline-offset-1 [&_select]:h-auto [&_select]:min-h-10 [&_select]:w-full [&_select]:min-w-0 [&_select]:rounded-lg [&_select]:border [&_select]:border-border [&_select]:bg-[color-mix(in_srgb,var(--background)_70%,transparent)] [&_select]:px-[13px] [&_select]:py-2 [&_select]:font-[13px/1.7_var(--font-geist-sans),sans-serif] [&_select]:text-foreground [&_select]:outline-offset-1 [&_select:has(+svg)]:pe-8 [&_input:focus]:border-primary [&_textarea:focus]:border-primary [&_select:focus]:border-primary min-h-svh bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_50%),var(--background)]">
      <SkipLink href={`#${contentId}`}>Skip to content</SkipLink>
      <Header asChild>
        <header className="admin-masthead sticky top-0 z-30 border-b border-border/80 bg-card/94 backdrop-blur-[14px] max-[767px]:relative">
          <div className="mx-auto grid w-[min(1200px,calc(100%-clamp(2rem,8vw,5rem)))] min-h-[4.25rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 max-[767px]:grid-cols-[minmax(0,1fr)_auto] max-[767px]:gap-x-3 max-[767px]:gap-y-1.5 max-[767px]:py-2.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Brand />
              <span className="text-xs text-muted-foreground">Portfolio studio</span>
            </div>
            <nav
              aria-label="Studio navigation"
              className="flex items-center gap-1 max-[767px]:col-span-full max-[767px]:row-start-2 [&_a]:h-auto [&_a]:min-h-[2.125rem] [&_a]:px-2.5 [&_a]:text-muted-foreground [&_a:hover]:bg-secondary [&_a:hover]:text-foreground"
            >
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
            {tools ? (
              <div className="ml-auto flex items-center gap-3 [&_.theme-toggle]:ml-1 [&>a]:grid [&>a]:size-10 [&>a]:shrink-0 [&>a]:place-items-center">
                {tools}
              </div>
            ) : null}
          </div>
        </header>
      </Header>
      {children}
      <HomeFooter action={{ href: "/admin", label: "Open studio", signedIn: true }} />
    </div>
  );
}

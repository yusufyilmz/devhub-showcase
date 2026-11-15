import { Separator } from "../../layout/seperator/Seperator";
import { SidebarTrigger } from "../sidebar/Sidebar";
import { siteHeaderStyles } from "./styles";
import type { SiteHeaderProps } from "./types";

export function SiteHeader({ actions, title = "Documents" }: SiteHeaderProps) {
  return (
    <header className={siteHeaderStyles.header}>
      <div className={siteHeaderStyles.content}>
        <SidebarTrigger className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
        <Separator className="mx-1 data-[orientation=vertical]:h-4" orientation="vertical" />
        <h1 className={siteHeaderStyles.title}>{title}</h1>
        {actions && <div className={siteHeaderStyles.actions}>{actions}</div>}
      </div>
    </header>
  );
}

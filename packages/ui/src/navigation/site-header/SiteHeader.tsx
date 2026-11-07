import { Separator } from "../../layout/seperator/Seperator";
import { SidebarTrigger } from "../sidebar/Sidebar";
import { siteHeaderStyles } from "./styles";
import type { SiteHeaderProps } from "./types";

export function SiteHeader({ actions, title = "Documents" }: SiteHeaderProps) {
  return (
    <header className={siteHeaderStyles.header}>
      <div className={siteHeaderStyles.content}>
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator className="mx-xs data-[orientation=vertical]:h-4" orientation="vertical" />
        <h1 className={siteHeaderStyles.title}>{title}</h1>
        {actions && <div className="ml-auto flex shrink-0 items-center gap-xs">{actions}</div>}
      </div>
    </header>
  );
}

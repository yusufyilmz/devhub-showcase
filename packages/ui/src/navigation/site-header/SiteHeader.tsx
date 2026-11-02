import { Button } from "../../buttons/button/Button";
import { Separator } from "../../layout/seperator/Seperator";
import { SidebarTrigger } from "../sidebar/Sidebar";
import { siteHeaderStyles } from "./styles";

export function SiteHeader() {
  return (
    <header className={siteHeaderStyles.element1}>
      <div className={siteHeaderStyles.element2}>
        <SidebarTrigger className={siteHeaderStyles.element3} />
        <Separator className={siteHeaderStyles.element4} orientation="vertical" />
        <h1 className={siteHeaderStyles.element5}>Documents</h1>
        <div className={siteHeaderStyles.element6}>
          <Button asChild className={siteHeaderStyles.element7} size="sm" variant="ghost">
            <a
              className={siteHeaderStyles.element8}
              href="https://github.com/sathittham/monorepo-vite-next-tailwind4-shadcn"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

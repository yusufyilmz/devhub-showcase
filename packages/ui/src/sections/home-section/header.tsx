import { Menu } from "lucide-react";

import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { Header } from "../../navigation/header/Header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu";
import { ThemeToggle } from "../../theme";
import { headerStyles } from "./styles";
import type { HomeHeaderOptions } from "./types";

const links = [
  { href: "#examples", label: "Examples" },
  { href: "#features", label: "Why MyDevStudio" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Plans" },
  { href: "#questions", label: "Questions" },
] as const;

export function HomeHeader({ action }: HomeHeaderOptions) {
  return (
    <Header asChild>
      <header className={headerStyles.element1}>
        <div className={headerStyles.element2}>
          <Brand />
          <nav aria-label="Main navigation" className={headerStyles.element3}>
            {links.map(({ href, label }) => (
              <Button href={href} key={href} size="sm" variant="ghost">
                {label}
              </Button>
            ))}
          </nav>
          <div className={headerStyles.element4}>
            <ThemeToggle />
            <Button className={headerStyles.element5} href={action.href} variant="outline">
              {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
            </Button>
            <div className="min-[761px]:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-label="Open navigation" size="icon-sm" variant="ghost">
                    <Menu aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {links.map(({ href, label }) => (
                    <DropdownMenuItem asChild key={href}>
                      <a href={href}>{label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </Header>
  );
}

import { Brand } from "@shared/ui/brand";
import { Button } from "@shared/ui/button";
import { Header } from "@shared/ui/header";
import { ThemeToggle } from "@shared/ui/theme";

import type { HomeHeaderOptions } from "./types";

const links = [
  { href: "#examples", label: "Examples" },
  { href: "#features", label: "Why MyDevStudio" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Plans" },
  { href: "#questions", label: "Questions" },
] as const;

export function HomeHeader({ action, accountMenu }: HomeHeaderOptions) {
  return (
    <Header
      actions={
        <>
          <Button
            className="site-navigation-cta [font-size:12px] [text-decoration:none] [display:inline-flex] [gap:24px] [align-items:center] [padding:11px_17px] [white-space:nowrap] [border:1px_solid_var(--border)] [border-radius:6px] @max-[760px]:[gap:6px] @max-[760px]:[padding:8px_10px] @max-[760px]:[font-size:11px]"
            href={action.href}
            variant="outline"
          >
            {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
          </Button>
          <ThemeToggle />
          {accountMenu}
        </>
      }
      brand={<Brand />}
      links={links}
    />
  );
}

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
          <Button className="site-navigation-cta" href={action.href} variant="outline">
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

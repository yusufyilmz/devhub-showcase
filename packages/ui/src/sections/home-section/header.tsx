import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { Header } from "../../navigation/header/Header";
import { ThemeToggle } from "../../theme";
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
    <Header
      actions={
        <>
          <ThemeToggle />
          <Button className="site-navigation-cta" href={action.href} variant="outline">
            {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
          </Button>
        </>
      }
      brand={<Brand />}
      links={links}
    />
  );
}

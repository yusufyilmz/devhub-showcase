import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { Header } from "../../navigation/header/Header";
import { ThemeToggle } from "../../theme";
import { headerStyles } from "./styles";
import type { HomeHeaderOptions } from "./types";

export function HomeHeader({ action }: HomeHeaderOptions) {
  return (
    <Header asChild>
      <header className={headerStyles.element1}>
        <div className={headerStyles.element2}>
          <Brand />
          <nav aria-label="Main navigation" className={headerStyles.element3}>
            <Button href="#examples" variant="link">
              Examples
            </Button>
            <Button href="#features" variant="link">
              Why MyDevStudio
            </Button>
            <Button href="#how-it-works" variant="link">
              How it works
            </Button>
            <Button href="#pricing" variant="link">
              Plans
            </Button>
            <Button href="#questions" variant="link">
              Questions
            </Button>
          </nav>
          <div className={headerStyles.element4}>
            <ThemeToggle />
            <Button className={headerStyles.element5} href={action.href} variant="outline">
              {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </header>
    </Header>
  );
}

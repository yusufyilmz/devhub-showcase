import { Brand } from "@shared/ui/brand";
import { Button } from "@shared/ui/button";
import { ThemeToggle } from "@shared/ui/theme";

import type { PageAction } from "./action";

export function Header({ action }: { action: PageAction }) {
  return (
    <header className="home-header">
      <div className="home-container home-header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="home-nav">
          <a href="#examples">Examples</a>
          <a href="#features">Why MyDevStudio</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Plans</a>
          <a href="#questions">Questions</a>
        </nav>
        <div className="home-header-actions">
          <ThemeToggle />
          <Button className="home-signin" href={action.href}>
            {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

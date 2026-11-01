import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { ThemeToggle } from "../../theme";
import type { PageAction } from "./action";

export function HomeHeader({ action }: { action: PageAction }) {
  return (
    <header className="home-header">
      <div className="home-container home-header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="home-nav">
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
        <div className="home-header-actions">
          <ThemeToggle />
          <Button className="home-signin" href={action.href} variant="outline">
            {action.signedIn ? "My studio" : "Sign in"} <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

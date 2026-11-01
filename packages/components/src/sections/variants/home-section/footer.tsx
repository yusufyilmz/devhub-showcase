import { Brand } from "@shared/ui/brand";
import { Button } from "@shared/ui/button";

import type { PageAction } from "./action";

export function HomeFooter({ action }: { action: PageAction }) {
  return (
    <footer className="home-container home-footer">
      <Brand />
      <p className="home-footer-copy">For the work you do. And the person behind it.</p>
      <div>
        <Button
          variant="link"
          href="https://github.com/yusufyilmz/devhub-showcase"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source on GitHub ↗
        </Button>
        <Button variant="link" href={action.href}>
          {action.signedIn ? "Open studio" : "Sign in"} ↗
        </Button>
      </div>
    </footer>
  );
}

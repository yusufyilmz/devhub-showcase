import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import type { PageAction } from "./action";

export function HomeFooter({ action }: { action: PageAction }) {
  return (
    <footer className="home-container home-footer">
      <Brand />
      <p className="home-footer-copy">For the work you do. And the person behind it.</p>
      <div>
        <Button
          href="https://github.com/yusufyilmz/devhub-showcase"
          rel="noopener noreferrer"
          target="_blank"
          variant="link"
        >
          Source on GitHub ↗
        </Button>
        <Button href={action.href} variant="link">
          {action.signedIn ? "Open studio" : "Sign in"} ↗
        </Button>
      </div>
    </footer>
  );
}

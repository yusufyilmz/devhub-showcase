import { Brand } from "@shared/ui/brand";

import type { PageAction } from "./action";

export function Footer({ action }: { action: PageAction }) {
  return (
    <footer className="home-container home-footer">
      <Brand />
      <p className="home-footer-copy">For the work you do. And the person behind it.</p>
      <div>
        <a
          href="https://github.com/yusufyilmz/devhub-showcase"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source on GitHub ↗
        </a>
        <a href={action.href}>{action.signedIn ? "Open studio" : "Sign in"} ↗</a>
      </div>
    </footer>
  );
}

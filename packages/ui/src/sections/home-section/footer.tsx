import { Button } from "../../buttons/button";
import { Brand } from "../../navigation/brand";
import { Footer } from "../../navigation/footer/Footer";
import { footerStyles } from "./styles";
import type { HomeFooterOptions } from "./types";

export function HomeFooter({ action }: HomeFooterOptions) {
  return (
    <Footer asChild>
      <footer className={footerStyles.element1}>
        <Brand />
        <p className={footerStyles.element2}>For the work you do. And the person behind it.</p>
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
    </Footer>
  );
}

import "../../styles/components/sections/footer.css";

import { ArrowUpRight } from "lucide-react";

import { Brand } from "../../navigation/brand";
import { Footer } from "../../navigation/footer/Footer";
import type { HomeFooterOptions } from "./types";

export function HomeFooter({ action }: HomeFooterOptions) {
  return (
    <Footer asChild>
      <footer className="platform-footer">
        <div className="platform-footer-inner">
          <div className="platform-footer-brand">
            <Brand />
            <p>Build a portfolio and CV that grow with your work.</p>
          </div>
          <nav aria-label="Footer navigation" className="platform-footer-nav">
            <div>
              <h2>Studio</h2>
              <ul>
                <li>
                  <a href={action.href}>{action.signedIn ? "Open studio" : "Sign in"}</a>
                </li>
                <li>
                  <a href="/#pricing">Plans</a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Explore</h2>
              <ul>
                <li>
                  <a href="/#examples">Portfolio examples</a>
                </li>
                <li>
                  <a href="/#features">Studio features</a>
                </li>
                <li>
                  <a href="/#how-it-works">How it works</a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Resources</h2>
              <ul>
                <li>
                  <a href="/#questions">Common questions</a>
                </li>
                <li>
                  <a
                    href="https://github.com/yusufyilmz/devhub-showcase"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Source on GitHub <ArrowUpRight aria-hidden="true" size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <p className="platform-footer-credit">© {new Date().getFullYear()} MyDevStudio</p>
        </div>
      </footer>
    </Footer>
  );
}

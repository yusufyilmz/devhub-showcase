import "../chrome.css";

import { Slot } from "@radix-ui/react-slot";

import { profile as fallback, getNameInitials, getPortfolioCopy } from "@shared/config";

import { footerStyles } from "./styles";
import type { FooterOptions } from "./types";

export function Footer({ profile = fallback, asChild = false, children }: FooterOptions) {
  if (asChild) return <Slot>{children}</Slot>;
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <footer className={footerStyles.element1}>
      <div>
        <a className={footerStyles.element2} href="#summary">
          {getNameInitials(profile.name)}
          <span>.</span>
        </a>
        <p>{text.footer}</p>
      </div>
      <div>
        {profile.github && (
          <a href={profile.github} rel="noopener noreferrer" target="_blank">
            GitHub ↗
          </a>
        )}
        <a href="/login">{text.createCv}</a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}

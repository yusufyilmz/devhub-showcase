import "../chrome.css";

import type { ReactNode } from "react";

import { Slot } from "@radix-ui/react-slot";

import {
  profile as fallback,
  getNameInitials,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/config";

export function Footer({
  profile = fallback,
  asChild = false,
  children,
}: {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
}) {
  if (asChild) return <Slot>{children}</Slot>;
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <footer className="site-footer">
      <div>
        <a className="brand-mark" href="#summary">
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

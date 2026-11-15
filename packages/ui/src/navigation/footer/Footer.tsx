import "../chrome.css";

import { Slot } from "@radix-ui/react-slot";

import { profile as fallback, getNameInitials, getPortfolioCopy } from "@shared/config";

import { footerStyles } from "./styles";
import type { FooterOptions } from "./types";

export function Footer({
  profile = fallback,
  asChild = false,
  children,
  brand,
  description,
  groups,
  credit,
  navigationLabel = "Footer navigation",
}: FooterOptions) {
  if (asChild) return <Slot>{children}</Slot>;
  if (brand && !groups?.length) {
    return (
      <footer className={footerStyles.compact}>
        {brand}
        {credit}
      </footer>
    );
  }
  if (brand) {
    return (
      <footer className={footerStyles.platform}>
        <div className={footerStyles.inner}>
          <div className={footerStyles.brand}>
            {brand}
            {description && <p>{description}</p>}
          </div>
          <nav aria-label={navigationLabel} className={footerStyles.navigation}>
            {groups?.map(({ title, links }) => (
              <div key={title}>
                <h2>{title}</h2>
                <ul>
                  {links.map(({ href, label, external }) => (
                    <li key={href}>
                      <a
                        href={href}
                        rel={external ? "noopener noreferrer" : undefined}
                        target={external ? "_blank" : undefined}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {credit && <p className={footerStyles.credit}>{credit}</p>}
        </div>
      </footer>
    );
  }
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

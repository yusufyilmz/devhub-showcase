import "../chrome.css";
import "./footer.css";

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
      <footer className="folio-footer">
        {brand}
        {credit}
      </footer>
    );
  }
  if (brand) {
    return (
      <footer className="platform-footer">
        <div className="platform-footer-inner">
          <div className="platform-footer-brand">
            {brand}
            {description && <p>{description}</p>}
          </div>
          <nav aria-label={navigationLabel} className="platform-footer-nav">
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
          {credit && <p className="platform-footer-credit">{credit}</p>}
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

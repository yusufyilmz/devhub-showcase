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
      <footer className="folio-footer flex justify-between gap-5 border-t border-border py-[30px] text-xs text-muted-foreground max-[600px]:flex-wrap">
        {brand}
        {credit}
      </footer>
    );
  }
  if (brand) {
    return (
      <footer className="platform-footer [background:radial-gradient(_ellipse_65%_50%_at_48%_110%,_color-mix(in_srgb,_var(--primary)_20%,_transparent),_transparent_85%_),_var(--card)] [border-block-start:1px_solid_color-mix(in_srgb,_var(--border)_70%,_transparent)]">
        <div className="platform-footer-inner [width:min(1200px,_calc(100%_-_clamp(2rem,_8vw,_5rem)))] [padding-block:clamp(2.5rem,_5vw,_4.75rem)_1.75rem] [margin-inline:auto]">
          <div className="platform-footer-brand [display:flex] [flex-wrap:wrap] [gap:0.5rem_1.5rem] [align-items:center] [margin-block-end:clamp(1.75rem,_4vw,_3rem)] [&_p]:[font-size:0.8125rem] [color:var(--muted-foreground)]">
            {brand}
            {description && <p>{description}</p>}
          </div>
          <nav
            aria-label={navigationLabel}
            className="platform-footer-nav [display:grid] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_9.25rem),_1fr))] [gap:1.5rem_1rem] [&_h2]:[margin-block-end:0.875rem] [font-size:0.875rem] [font-weight:650] [color:var(--foreground)] [&_ul]:[display:grid] [gap:0.625rem] [&_a]:[display:inline-flex] [gap:0.25rem] [align-items:center] [color:var(--muted-foreground)] [text-underline-offset:0.25rem] [&_a:hover]:[color:var(--foreground)] [text-decoration:underline]"
          >
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
          {credit && (
            <p className="platform-footer-credit [font-size:0.8125rem] [color:var(--muted-foreground)] [padding-block-start:1rem] [margin-block-start:clamp(1.75rem,_4vw,_3rem)] [border-block-start:1px_solid_color-mix(in_srgb,_var(--border)_60%,_transparent)]">
              {credit}
            </p>
          )}
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

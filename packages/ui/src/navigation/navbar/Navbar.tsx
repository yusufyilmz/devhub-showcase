import "../chrome.css";

import { profile as fallback, getNameInitials, getPortfolioCopy } from "@shared/config";

import { ThemeToggle } from "../../theme/theme-toggle";
import { MenuItems } from "./MenuItems";
import { MobileMenu } from "./MobileMenu";
import { navbarStyles } from "./styles";
import type { NavbarOptions } from "./types";

export function Navbar({ profile = fallback }: NavbarOptions) {
  const anchors = {
    about: "#about-me",
    education: "#educations",
    experience: "#experiences",
    languages: "#languages",
    projects: "#projects",
    skills: "#skills",
  };
  const hiddenLinks = Object.entries(profile.sectionSettings ?? {})
    .filter(([, settings]) => settings?.visible === false)
    .map(([kind]) => anchors[kind as keyof typeof anchors]);
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <nav className={navbarStyles.element1}>
      <a
        aria-label={`${profile.name} ${text.home}`}
        className={navbarStyles.element2}
        href="#summary"
      >
        {getNameInitials(profile.name)}
        <span>.</span>
      </a>
      <div className={navbarStyles.element3}>
        <MenuItems hiddenLinks={hiddenLinks} language={profile.portfolioLanguage} />
      </div>
      <div className={navbarStyles.element4}>
        <a className={navbarStyles.element5} href="/login">
          {text.createCv} ↗
        </a>
        <ThemeToggle labels={{ dark: text.switchDark, light: text.switchLight }} />
        <MobileMenu hiddenLinks={hiddenLinks} language={profile.portfolioLanguage} />
      </div>
    </nav>
  );
}

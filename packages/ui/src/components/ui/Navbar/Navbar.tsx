import {
  profile as fallback,
  getNameInitials,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/content";

import { ThemeToggle } from "../../../theme/theme-toggle";
import { MenuItems } from "./MenuItems";
import { MobileMenu } from "./MobileMenu";
export function Navbar({ profile = fallback }: { profile?: PortfolioProfile }) {
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
    <nav className="portfolio-nav">
      <a aria-label={`${profile.name} ${text.home}`} className="brand-mark" href="#summary">
        {getNameInitials(profile.name)}
        <span>.</span>
      </a>
      <div className="nav-links">
        <MenuItems hiddenLinks={hiddenLinks} language={profile.portfolioLanguage} />
      </div>
      <div className="nav-tools">
        <a className="nav-contact" href="/admin/login">
          {text.createCv} ↗
        </a>
        <ThemeToggle labels={{ dark: text.switchDark, light: text.switchLight }} />
        <MobileMenu hiddenLinks={hiddenLinks} language={profile.portfolioLanguage} />
      </div>
    </nav>
  );
}

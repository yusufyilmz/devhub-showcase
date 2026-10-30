import {
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile
} from '@shared/content'
import { ThemeToggle } from '../../../theme'
import { MenuItems } from './MenuItems'
import { MobileMenu } from './MobileMenu'
export function Navbar({ profile = fallback }: { profile?: PortfolioProfile }) {
  const anchors = {
    about: '#about-me',
    experience: '#experiences',
    projects: '#projects',
    skills: '#skills',
    education: '#educations',
    languages: '#languages'
  }
  const hiddenLinks = Object.entries(profile.sectionSettings ?? {})
    .filter(([, settings]) => settings?.visible === false)
    .map(([kind]) => anchors[kind as keyof typeof anchors])
  const text = getPortfolioCopy(profile.portfolioLanguage)
  return (
    <nav className="portfolio-nav">
      <a
        href="#summary"
        className="brand-mark"
        aria-label={`${profile.name} ${text.home}`}
      >
        {profile.name.slice(0, 1)}
        <span>.</span>
      </a>
      <div className="nav-links">
        <MenuItems
          language={profile.portfolioLanguage}
          hiddenLinks={hiddenLinks}
        />
      </div>
      <div className="nav-tools">
        <a className="nav-contact" href="/admin/login">
          {text.createCv} ↗
        </a>
        <ThemeToggle
          labels={{ light: text.switchLight, dark: text.switchDark }}
        />
        <MobileMenu
          language={profile.portfolioLanguage}
          hiddenLinks={hiddenLinks}
        />
      </div>
    </nav>
  )
}

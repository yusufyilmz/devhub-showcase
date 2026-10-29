import {
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile
} from '@shared/content'
import { ThemeToggle } from '../../../theme'
import { MenuItems } from './MenuItems'
import { MobileMenu } from './MobileMenu'
export function Navbar({ profile = fallback }: { profile?: PortfolioProfile }) {
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
        <MenuItems language={profile.portfolioLanguage} />
      </div>
      <div className="nav-tools">
        <a className="nav-contact" href="/admin/login">
          {text.createCv} ↗
        </a>
        <ThemeToggle
          labels={{ light: text.switchLight, dark: text.switchDark }}
        />
        <MobileMenu language={profile.portfolioLanguage} />
      </div>
    </nav>
  )
}

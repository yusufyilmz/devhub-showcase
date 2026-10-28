import { profile as fallback, type PortfolioProfile } from '@shared/content'
import { ThemeToggle } from '../../../theme'
import { MenuItems } from './MenuItems'
import { MobileMenu } from './MobileMenu'
export function Navbar({ profile = fallback }: { profile?: PortfolioProfile }) {
  return (
    <nav className="portfolio-nav">
      <a
        href="#summary"
        className="brand-mark"
        aria-label={`${profile.name} home`}
      >
        {profile.name.slice(0, 1)}
        <span>.</span>
      </a>
      <div className="nav-links">
        <MenuItems />
      </div>
      <div className="nav-tools">
        <a className="nav-contact" href="/admin/login">
          Create your CV ↗
        </a>
        <ThemeToggle />
        <MobileMenu />
      </div>
    </nav>
  )
}

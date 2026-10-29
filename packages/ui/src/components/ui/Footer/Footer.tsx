import {
  profile as fallback,
  getPortfolioCopy,
  type PortfolioProfile
} from '@shared/content'
export function Footer({ profile = fallback }: { profile?: PortfolioProfile }) {
  const text = getPortfolioCopy(profile.portfolioLanguage)
  return (
    <footer className="site-footer">
      <div>
        <a className="brand-mark" href="#summary">
          {profile.name.slice(0, 1)}
          <span>.</span>
        </a>
        <p>{text.footer}</p>
      </div>
      <div>
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        )}
        <a href="/admin/login">{text.createCv}</a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}

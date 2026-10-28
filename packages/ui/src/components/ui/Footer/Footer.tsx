import { profile as fallback, type PortfolioProfile } from '@shared/content'
export function Footer({ profile = fallback }: { profile?: PortfolioProfile }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand-mark" href="/#summary">
          {profile.name.slice(0, 1)}
          <span>.</span>
        </a>
        <p>Thoughtfully built. Always evolving.</p>
      </div>
      <div>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href="/admin">Studio</a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}

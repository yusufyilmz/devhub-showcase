import {
  profile as fallback,
  getNameInitials,
  getPortfolioCopy,
  type PortfolioProfile,
} from "@shared/content";
export function Footer({ profile = fallback }: { profile?: PortfolioProfile }) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <footer className="site-footer">
      <div>
        <a className="brand-mark" href="#summary">
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
        <a href="/admin/login">{text.createCv}</a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}

import { profile as fallback, getPortfolioCopy, type PortfolioProfile } from "@shared/content";
export function SummarySection({ profile = fallback }: { profile?: PortfolioProfile }) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const firstYear = profile.experiences.map((item) => item.start.slice(0, 4)).sort()[0];
  return (
    <section className="portfolio-hero" id="summary">
      <div aria-hidden="true" className="hero-orbit" />
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" />
          {profile.location}
        </p>
        <h1>
          {profile.name}
          <span className="accent-period">.</span>
        </h1>
        <h2>{profile.title}</h2>
        <p className="hero-intro">{profile.summary}</p>
        <div className="hero-actions">
          <a className="studio-primary" href="#projects">
            {text.exploreWork} <span aria-hidden="true">↗</span>
          </a>
          <a className="studio-secondary" href={`mailto:${profile.email}`}>
            {text.letsTalk}
          </a>
        </div>
        <div className="hero-details">
          <span>
            {firstYear ? (
              <>
                {text.since} <strong>{firstYear}</strong>
              </>
            ) : (
              text.yourStory
            )}
          </span>
          <span>
            <strong>{profile.experiences.length}</strong> {text.roles}
          </span>
        </div>
      </div>
      <a className="hero-scroll" href="#about-me">
        {text.scroll} <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

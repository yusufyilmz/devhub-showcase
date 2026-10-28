import { profile as fallback, type PortfolioProfile } from '@shared/content'
export function SummarySection({
  profile = fallback
}: {
  profile?: PortfolioProfile
}) {
  const firstYear = profile.experiences
    .map((item) => item.start.slice(0, 4))
    .sort()[0]
  return (
    <section id="summary" className="portfolio-hero">
      <div className="hero-orbit" aria-hidden="true" />
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
            Explore my work <span aria-hidden="true">↗</span>
          </a>
          <a className="studio-secondary" href={`mailto:${profile.email}`}>
            Let’s talk
          </a>
        </div>
        <div className="hero-details">
          <span>
            {firstYear ? (
              <>
                Working since <strong>{firstYear}</strong>
              </>
            ) : (
              'Your story, in your words'
            )}
          </span>
          <span>
            <strong>{profile.experiences.length}</strong> roles, one evolving
            craft
          </span>
        </div>
      </div>
      <a className="hero-scroll" href="#about-me">
        SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}

import type { PortfolioProfile } from '@shared/content'
import { ThemeToggle } from '@shared/ui/theme'

export function PortfolioLayout({
  profile,
  username
}: {
  profile: PortfolioProfile
  username: string
}) {
  const type = profile.portfolioType ?? 'minimal'
  const projects = profile.projects.filter((project) => project.public)
  const designer = type === 'designer'
  return (
    <div className="folio" data-portfolio-type={type}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="folio-nav">
        <a href={`/${username}`} className="folio-name">
          {profile.name}
        </a>
        <nav aria-label="Portfolio sections">
          {projects.length > 0 && <a href="#work">Work</a>}
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <ThemeToggle />
      </header>
      <main id="main-content" className="folio-main">
        <section className="folio-intro" aria-labelledby="folio-title">
          <p className="folio-eyebrow">{profile.location}</p>
          <h1 id="folio-title">
            {profile.name}
            <span aria-hidden="true">.</span>
          </h1>
          <p className="folio-role">{profile.title}</p>
          <p className="folio-summary">{profile.summary}</p>
          <div className="folio-actions">
            {projects.length > 0 && (
              <a className="folio-primary" href="#work">
                Explore my work <span aria-hidden="true">↗</span>
              </a>
            )}
            <a href={`/${username}/cv.pdf`}>
              Download CV <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <div className="folio-story">
          {designer && projects.length > 0 && <Work profile={profile} visual />}
          <section id="about" className="folio-section">
            <p className="folio-eyebrow">The person behind the work</p>
            <h2>About me</h2>
            {profile.about.length > 0 ? (
              profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            ) : (
              <p>{profile.summary}</p>
            )}
          </section>
          {profile.experiences.length > 0 && (
            <section
              className="folio-section"
              aria-labelledby="folio-experience"
            >
              <h2 id="folio-experience">Experience</h2>
              {profile.experiences.map((experience) => (
                <article key={experience.id} className="folio-experience">
                  <div className="folio-row">
                    <h3>{experience.position}</h3>
                    <span>
                      {experience.start.slice(0, 4)} —{' '}
                      {experience.end?.slice(0, 4) ?? 'Present'}
                    </span>
                  </div>
                  <a href={experience.companyUrl} rel="noopener noreferrer">
                    {experience.company}
                  </a>
                  {experience.achievements.length > 0 && (
                    <ul>
                      {experience.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          )}
          {!designer && projects.length > 0 && <Work profile={profile} />}
          {Object.keys(profile.skills).length > 0 && (
            <section className="folio-section">
              <h2>{designer ? 'Creative toolkit' : 'Expertise'}</h2>
              <dl className="folio-skills">
                {Object.entries(profile.skills).map(([group, skills]) => (
                  <div key={group}>
                    <dt>{group}</dt>
                    <dd>{skills.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {profile.education.length > 0 && (
            <section className="folio-section">
              <h2>Education</h2>
              {profile.education.map((education) => (
                <article key={education.id} className="folio-experience">
                  <h3>
                    {education.degree} · {education.field}
                  </h3>
                  <p>
                    <a href={education.url}>{education.institution}</a> ·{' '}
                    {education.start.slice(0, 4)} — {education.end.slice(0, 4)}
                  </p>
                </article>
              ))}
            </section>
          )}
          {profile.languages.length > 0 && (
            <section className="folio-section">
              <h2>Languages</h2>
              <p>
                {profile.languages
                  .map(
                    (language) =>
                      `${language.language} (${language.proficiency})`
                  )
                  .join(' · ')}
              </p>
            </section>
          )}
          <section id="contact" className="folio-section folio-contact">
            <p className="folio-eyebrow">Start a conversation</p>
            <h2>Let’s make something worthwhile.</h2>
            <a className="folio-email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            {profile.phone && <p>{profile.phone}</p>}
            <div className="folio-actions">
              {profile.website && <a href={profile.website}>Website ↗</a>}
              {profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}
              {profile.github && <a href={profile.github}>GitHub ↗</a>}
            </div>
          </section>
        </div>
      </main>
      <footer className="folio-footer">
        <span>{profile.name}</span>
        <a href="/">Made with MyDevStudio ↗</a>
      </footer>
    </div>
  )
}

function Work({
  profile,
  visual = false
}: {
  profile: PortfolioProfile
  visual?: boolean
}) {
  return (
    <section id="work" className="folio-section">
      <p className="folio-eyebrow">A selection of what I do</p>
      <h2>{visual ? 'Selected work' : 'Projects & client work'}</h2>
      <div className={visual ? 'folio-gallery' : 'folio-project-list'}>
        {profile.projects
          .filter((project) => project.public)
          .map((project, index) => (
            <article key={project.id} className="folio-project">
              {visual && (
                <div className="folio-cover">
                  {project.coverImage ? (
                    // Public user supplied images are loaded directly by the visitor;
                    // the app server never fetches arbitrary remote image URLs.
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      width={800}
                      height={600}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
              )}
              <div className="folio-project-copy">
                <p className="folio-eyebrow">{project.company}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {project.skills.length > 0 && (
                  <p className="folio-tags">{project.skills.join(' · ')}</p>
                )}
                <div className="folio-actions">
                  {project.url && <a href={project.url}>View project ↗</a>}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl}>Source code ↗</a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}

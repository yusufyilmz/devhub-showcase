import type { ReactNode } from "react";

import { HeroSurface } from "@shared/components/hero-surface";
import {
  formatPortfolioPeriod,
  getNameInitials,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent,
} from "@shared/content";
import { ThemeToggle } from "@shared/ui/theme";

import { RegisteredSections } from "./registered-sections";

export function PortfolioLayout({
  profile,
  username,
}: {
  profile: PortfolioProfile;
  username: string;
}) {
  const canonicalProfile = profile;
  profile = selectPortfolioContent(profile);
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const type = profile.portfolioType ?? "minimal";
  const projects =
    profile.sectionSettings?.projects?.visible === false
      ? []
      : profile.projects.filter((project) => project.public);
  return (
    <div className="folio" data-portfolio-type={type}>
      <a className="skip-link" href="#main-content">
        {text.skip}
      </a>
      <header className="folio-nav">
        <a className="folio-name" href={`/${username}`}>
          <span aria-hidden="true" className="folio-monogram">
            {getNameInitials(profile.name)}
          </span>
          {profile.name}
        </a>
        <nav aria-label={text.sections}>
          {projects.length > 0 && <a href="#work">{text.work}</a>}
          {profile.sectionSettings?.about?.visible !== false && <a href="#about">{text.about}</a>}
          <a href="#contact">{text.contact}</a>
        </nav>
        <ThemeToggle labels={{ dark: text.switchDark, light: text.switchLight }} />
      </header>
      <main className="folio-main" id="main-content">
        <HeroSurface
          labels={{ pause: text.pauseBackground, play: text.playBackground }}
          media={profile.hero}
        >
          <section aria-labelledby="folio-title" className="folio-intro">
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
                  {text.exploreWork} <span aria-hidden="true">↗</span>
                </a>
              )}
              <a href={`/${username}/cv.pdf`}>
                {text.downloadCv} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>
        </HeroSurface>
        <div className="folio-story">
          <FolioSections profile={profile} sourceProfile={canonicalProfile} />
          <section className="folio-section folio-contact" id="contact">
            <p className="folio-eyebrow">{text.conversation}</p>
            <h2>{text.contactHeading}</h2>
            <a className="folio-email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            {profile.phone && <p>{profile.phone}</p>}
            <div className="folio-actions">
              {profile.website && <a href={profile.website}>{text.website} ↗</a>}
              {profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}
              {profile.github && <a href={profile.github}>GitHub ↗</a>}
            </div>
          </section>
        </div>
      </main>
      <footer className="folio-footer">
        <span>{profile.name}</span>
        <a href="/">{text.madeWith} ↗</a>
      </footer>
    </div>
  );
}

function Work({ profile, visual = false }: { profile: PortfolioProfile; visual?: boolean }) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <section className="folio-section" id="work">
      <p className="folio-eyebrow">{text.workSelection}</p>
      <h2>{visual ? text.selectedWork : text.clientWork}</h2>
      <div className={visual ? "folio-gallery" : "folio-project-list"}>
        {profile.projects
          .filter((project) => project.public)
          .map((project, index) => (
            <article className="folio-project" key={project.id}>
              {visual && (
                <div className="folio-cover">
                  {project.coverImage ? (
                    // Public user supplied images are loaded directly by the visitor;
                    // the app server never fetches arbitrary remote image URLs.
                    <img
                      alt={project.name}
                      height={600}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      src={project.coverImage}
                      width={800}
                    />
                  ) : (
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  )}
                </div>
              )}
              <div className="folio-project-copy">
                <p className="folio-eyebrow">{project.company}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                {project.skills.length > 0 && (
                  <p className="folio-tags">{project.skills.join(" · ")}</p>
                )}
                <div className="folio-actions">
                  {project.url && <a href={project.url}>{text.viewProject} ↗</a>}
                  {project.sourceUrl && <a href={project.sourceUrl}>{text.sourceCode} ↗</a>}
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function FolioSections({
  profile,
  sourceProfile = profile,
}: {
  profile: PortfolioProfile;
  sourceProfile?: PortfolioProfile;
}) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const designer = profile.portfolioType === "designer";
  const projects = profile.projects.filter((project) => project.public);
  const renderers: Partial<Record<SectionRendererId, ReactNode>> = {
    "education-list": profile.education.length > 0 && (
      <section className="folio-section">
        <h2>{text.education}</h2>
        {profile.education.map((education) => (
          <article className="folio-experience" key={education.id}>
            <h3>
              {education.degree} · {education.field}
            </h3>
            <p>
              {education.url ? (
                <a href={education.url}>{education.institution}</a>
              ) : (
                education.institution
              )}{" "}
              · {formatPortfolioPeriod(education.start, education.end, profile.portfolioLanguage)}
            </p>
          </article>
        ))}
      </section>
    ),
    "experience-list": profile.experiences.length > 0 && (
      <section aria-labelledby="folio-experience" className="folio-section">
        <h2 id="folio-experience">{text.experience}</h2>
        {profile.experiences.map((experience) => (
          <article className="folio-experience" key={experience.id}>
            <div className="folio-row">
              <h3>{experience.position}</h3>
              <span>
                {formatPortfolioPeriod(experience.start, experience.end, profile.portfolioLanguage)}
              </span>
            </div>
            {experience.companyUrl ? (
              <a href={experience.companyUrl} rel="noopener noreferrer">
                {experience.company}
              </a>
            ) : (
              experience.company
            )}
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
    ),
    "language-list": profile.languages.length > 0 && (
      <section className="folio-section">
        <h2>{text.spokenLanguages}</h2>
        <p>
          {profile.languages
            .map((language) => `${language.language} (${language.proficiency})`)
            .join(" · ")}
        </p>
      </section>
    ),
    "project-gallery": projects.length > 0 && <Work profile={profile} visual />,
    "project-list": projects.length > 0 && <Work profile={profile} />,
    prose: (
      <section className="folio-section" id="about">
        <p className="folio-eyebrow">{text.personBehind}</p>
        <h2>{text.about}</h2>
        {profile.about.length > 0 ? (
          profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p>{profile.summary}</p>
        )}
      </section>
    ),
    "skill-list": Object.keys(profile.skills).length > 0 && (
      <section className="folio-section">
        <h2>{designer ? text.creativeToolkit : text.expertise}</h2>
        <dl className="folio-skills">
          {Object.entries(profile.skills).map(([group, skills]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    ),
  };
  return <RegisteredSections profile={sourceProfile} renderers={renderers} />;
}

import "@shared/ui/portfolios.css";

import type { ReactNode } from "react";

import {
  formatPortfolioPeriod,
  getNameInitials,
  getPortfolioCopy,
  type PortfolioProfile,
  type SectionRendererId,
  selectPortfolioContent,
} from "@shared/config";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Footer } from "@shared/ui/footer";
import { Header, SkipLink } from "@shared/ui/header";
import { HeroSurface } from "@shared/ui/layout";
import { ThemeToggle } from "@shared/ui/theme";

import { type ArrangePortfolioSections, RegisteredSections } from "./registered-sections";

export function PortfolioLayout({
  arrange,
  profile,
  username,
}: {
  arrange?: ArrangePortfolioSections;
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
    <div
      className="folio group/folio mx-auto max-w-[1440px] px-14 text-foreground wrap-anywhere max-[900px]:px-7 max-[600px]:px-5 data-[portfolio-type=minimal]:max-w-[880px] [&_a]:text-inherit [&_a]:underline-offset-[5px] [&_a:focus-visible]:outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-primary [&_h1]:mt-0 [&_h1]:mb-[30px] [&_h1]:text-[clamp(54px,7vw,110px)] [&_h1]:leading-[0.98] [&_h1]:font-semibold [&_h1]:tracking-[-0.07em] [&_h1]:wrap-anywhere max-[600px]:[&_h1]:text-[54px] [&_h2]:wrap-anywhere [&_h3]:wrap-anywhere [&_p]:wrap-anywhere [&_h1_span]:text-primary data-[portfolio-type=consultant]:[&_h1]:text-[clamp(42px,5vw,74px)] data-[portfolio-type=minimal]:[&_h1]:font-[Georgia,serif] data-[portfolio-type=minimal]:[&_h1]:text-[clamp(42px,5vw,66px)] data-[portfolio-type=minimal]:[&_h1]:font-normal data-[portfolio-type=minimal]:[&_h1]:tracking-[-0.04em] data-[portfolio-type=creator]:[&_h1]:text-[clamp(52px,7vw,96px)]"
      data-portfolio-type={type}
    >
      <SkipLink href="#main-content">{text.skip}</SkipLink>
      <Header
        actions={<ThemeToggle labels={{ dark: text.switchDark, light: text.switchLight }} />}
        brand={
          <a
            className="folio-name mr-auto inline-flex max-[600px]:max-w-[calc(100%-60px)] items-center gap-[0.65rem] text-base font-bold no-underline"
            href={`/${username}`}
          >
            <span
              aria-hidden="true"
              className="folio-monogram inline-flex size-9 shrink-0 items-center justify-center rounded-[0.65rem] border border-current text-[0.85rem] text-accent"
            >
              {getNameInitials(profile.name)}
            </span>
            {profile.name}
          </a>
        }
        links={[
          ...(projects.length > 0 ? [{ href: "#work", label: text.work }] : []),
          ...(profile.sectionSettings?.about?.visible !== false
            ? [{ href: "#about", label: text.about }]
            : []),
          { href: "#contact", label: text.contact },
        ]}
        menuLabel={text.menu}
        navigationLabel={text.sections}
      />
      <main
        className="folio-main group-data-[portfolio-type=consultant]/folio:grid group-data-[portfolio-type=consultant]/folio:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] group-data-[portfolio-type=consultant]/folio:gap-[90px] group-data-[portfolio-type=consultant]/folio:pt-[70px] max-[900px]:group-data-[portfolio-type=consultant]/folio:grid-cols-1 max-[900px]:group-data-[portfolio-type=consultant]/folio:gap-0 max-[900px]:group-data-[portfolio-type=consultant]/folio:pt-0"
        id="main-content"
      >
        <HeroSurface
          labels={{ pause: text.pauseBackground, play: text.playBackground }}
          media={profile.hero}
        >
          <section
            aria-labelledby="folio-title"
            className="folio-intro pt-[100px] pb-[85px] max-[600px]:py-16 group-data-[portfolio-type=consultant]/folio:sticky group-data-[portfolio-type=consultant]/folio:top-9 group-data-[portfolio-type=consultant]/folio:self-start group-data-[portfolio-type=consultant]/folio:p-0 group-data-[portfolio-type=consultant]/folio:pb-[70px] max-[900px]:group-data-[portfolio-type=consultant]/folio:static max-[900px]:group-data-[portfolio-type=consultant]/folio:pt-[70px] group-data-[portfolio-type=minimal]/folio:pt-20 group-data-[portfolio-type=minimal]/folio:pb-[55px] group-data-[portfolio-type=creator]/folio:pt-20 group-data-[portfolio-type=creator]/folio:pb-10"
          >
            <p className="folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              {profile.location}
            </p>
            <h1 id="folio-title">
              {profile.name}
              <span aria-hidden="true">.</span>
            </h1>
            <p className="folio-role mb-7 max-w-[800px] text-[clamp(22px,3vw,38px)] leading-[1.2] tracking-[-0.03em] group-data-[portfolio-type=consultant]/folio:text-[26px] group-data-[portfolio-type=minimal]/folio:text-[23px] group-data-[portfolio-type=trainer]/folio:text-[clamp(22px,3vw,34px)]">
              {profile.title}
            </p>
            <p className="folio-summary mb-[30px] max-w-[720px] text-[17px] leading-[1.8] text-muted-foreground group-data-[portfolio-type=consultant]/folio:text-[15px]">
              {profile.summary}
            </p>
            <div className="folio-actions mt-6 flex flex-wrap items-center gap-6 text-[13px] [&_a]:py-2.5">
              {projects.length > 0 && (
                <Button
                  className="folio-primary rounded-[3px] border border-primary bg-primary px-5 py-3.5 font-[650] text-background no-underline"
                  href="#work"
                >
                  {text.exploreWork} <span aria-hidden="true">↗</span>
                </Button>
              )}
              <a href={`/${username}/cv.pdf`}>
                {text.downloadCv} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </section>
        </HeroSurface>
        <div className="folio-story">
          <FolioSections arrange={arrange} profile={profile} sourceProfile={canonicalProfile} />
          <section
            className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px] folio-contact py-[70px]"
            id="contact"
          >
            <p className="folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              {text.conversation}
            </p>
            <h2>{text.contactHeading}</h2>
            <a
              className="folio-email my-2.5 mt-2.5 mb-5 inline-block max-w-full text-[clamp(20px,3vw,36px)] tracking-[-0.03em] text-primary"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
            {profile.phone && <p>{profile.phone}</p>}
            <div className="folio-actions mt-6 flex flex-wrap items-center gap-6 text-[13px] [&_a]:py-2.5">
              {profile.website && <a href={profile.website}>{text.website} ↗</a>}
              {profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}
              {profile.github && <a href={profile.github}>GitHub ↗</a>}
            </div>
          </section>
        </div>
      </main>
      <Footer brand={<span>{profile.name}</span>} credit={<a href="/">{text.madeWith} ↗</a>} />
    </div>
  );
}

function Work({ profile, visual = false }: { profile: PortfolioProfile; visual?: boolean }) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  return (
    <section
      className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]"
      id="work"
    >
      <p className="folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        {text.workSelection}
      </p>
      <h2>{visual ? text.selectedWork : text.clientWork}</h2>
      <div
        className={
          visual
            ? "folio-gallery grid grid-cols-2 gap-x-8 gap-y-[50px] max-[600px]:grid-cols-1 max-[600px]:[&_.folio-project:first-child]:col-auto [&_.folio-project:first-child]:col-span-full [&_.folio-project:first-child_.folio-cover]:aspect-video"
            : "folio-project-list [&_.folio-project]:border-b [&_.folio-project]:border-[color-mix(in_srgb,var(--border)_50%,transparent)] [&_.folio-project]:py-7"
        }
      >
        {profile.projects
          .filter((project) => project.public)
          .map((project, index) => (
            <Card asChild interaction="lift" key={project.id} layout="plain" surface="portfolio">
              <article className="folio-project">
                {visual && (
                  <div className="folio-cover mb-6 grid aspect-[4/3] place-items-center overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_10%,transparent),var(--card))] [&_img]:size-full [&_img]:object-cover [&_span]:font-[300_clamp(60px,12vw,180px)_var(--font-geist-mono),monospace] [&_span]:text-[color-mix(in_srgb,var(--primary)_25%,transparent)]">
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
                <div className="folio-project-copy max-w-[800px] [&_.folio-eyebrow]:mb-2">
                  <p className="folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                    {project.company}
                  </p>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  {project.skills.length > 0 && (
                    <p className="folio-tags text-[11px] text-primary">
                      {project.skills.join(" · ")}
                    </p>
                  )}
                  <div className="folio-actions mt-6 flex flex-wrap items-center gap-6 text-[13px] [&_a]:py-2.5">
                    {project.url && <a href={project.url}>{text.viewProject} ↗</a>}
                    {project.sourceUrl && <a href={project.sourceUrl}>{text.sourceCode} ↗</a>}
                  </div>
                </div>
              </article>
            </Card>
          ))}
      </div>
    </section>
  );
}

function FolioSections({
  arrange,
  profile,
  sourceProfile = profile,
}: {
  profile: PortfolioProfile;
  arrange?: ArrangePortfolioSections;
  sourceProfile?: PortfolioProfile;
}) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const designer = profile.portfolioType === "designer" || profile.portfolioType === "creator";
  const projects = profile.projects.filter((project) => project.public);
  const renderers: Partial<Record<SectionRendererId, ReactNode>> = {
    "education-list": profile.education.length > 0 && (
      <section className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]">
        <h2>{text.education}</h2>
        {profile.education.map((education) => (
          <article
            className="folio-experience py-[22px] [&_a]:text-sm group-data-[portfolio-type=trainer]/folio:rounded-xl group-data-[portfolio-type=trainer]/folio:border group-data-[portfolio-type=trainer]/folio:border-border group-data-[portfolio-type=trainer]/folio:bg-card group-data-[portfolio-type=trainer]/folio:p-[22px] group-data-[portfolio-type=trainer]/folio:[&+&]:mt-4"
            key={education.id}
          >
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
      <section
        aria-labelledby="folio-experience py-[22px] [&_a]:text-sm group-data-[portfolio-type=trainer]/folio:rounded-xl group-data-[portfolio-type=trainer]/folio:border group-data-[portfolio-type=trainer]/folio:border-border group-data-[portfolio-type=trainer]/folio:bg-card group-data-[portfolio-type=trainer]/folio:p-[22px] group-data-[portfolio-type=trainer]/folio:[&+&]:mt-4"
        className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]"
      >
        <h2 id="folio-experience py-[22px] [&_a]:text-sm group-data-[portfolio-type=trainer]/folio:rounded-xl group-data-[portfolio-type=trainer]/folio:border group-data-[portfolio-type=trainer]/folio:border-border group-data-[portfolio-type=trainer]/folio:bg-card group-data-[portfolio-type=trainer]/folio:p-[22px] group-data-[portfolio-type=trainer]/folio:[&+&]:mt-4">
          {text.experience}
        </h2>
        {profile.experiences.map((experience) => (
          <article
            className="folio-experience py-[22px] [&_a]:text-sm group-data-[portfolio-type=trainer]/folio:rounded-xl group-data-[portfolio-type=trainer]/folio:border group-data-[portfolio-type=trainer]/folio:border-border group-data-[portfolio-type=trainer]/folio:bg-card group-data-[portfolio-type=trainer]/folio:p-[22px] group-data-[portfolio-type=trainer]/folio:[&+&]:mt-4"
            key={experience.id}
          >
            <div className="folio-row flex justify-between gap-6 max-[600px]:mb-[15px] max-[600px]:flex-col max-[600px]:gap-0 [&_span]:shrink-0 [&_span]:pt-1.5 [&_span]:text-xs [&_span]:text-muted-foreground">
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
      <section className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]">
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
      <section
        className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]"
        id="about"
      >
        <p className="folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {text.personBehind}
        </p>
        <h2>{text.about}</h2>
        {profile.about.length > 0 ? (
          profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        ) : (
          <p>{profile.summary}</p>
        )}
      </section>
    ),
    "skill-list": Object.keys(profile.skills).length > 0 && (
      <section className="folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px]">
        <h2>{designer ? text.creativeToolkit : text.expertise}</h2>
        <dl className="folio-skills grid grid-cols-2 gap-7 max-[600px]:grid-cols-1 [&_dt]:mb-2.5 [&_dt]:text-sm [&_dt]:font-semibold [&_dd]:m-0">
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
  return <RegisteredSections arrange={arrange} profile={sourceProfile} renderers={renderers} />;
}

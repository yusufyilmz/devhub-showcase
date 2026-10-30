import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs,
} from "@shared/components/section-views";
import {
  formatPortfolioPeriod,
  getPortfolioCopy,
  type PortfolioProfile,
  type PortfolioSection,
  type SectionRendererId,
  sectionRendererViews,
  selectPortfolioContent,
} from "@shared/content";

function sectionItems(profile: PortfolioProfile, kind: PortfolioSection["kind"]): SectionItem[] {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const period = (start: string, end: string | null) =>
    formatPortfolioPeriod(start, end, profile.portfolioLanguage);
  switch (kind) {
    case "about":
      return [
        {
          content: (
            <>
              {(profile.about.length ? profile.about : [profile.summary]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </>
          ),
          id: "about",
          title: profile.name,
        },
      ];
    case "projects":
      return profile.projects.map((item) => ({
        content: (
          <>
            {item.coverImage && (
              <img
                alt={item.name}
                height={600}
                loading="lazy"
                referrerPolicy="no-referrer"
                src={item.coverImage}
                style={{ height: "auto", maxWidth: "100%" }}
                width={800}
              />
            )}
            <p>{item.company}</p>
            <p>{item.description}</p>
            <p>{item.skills.join(" · ")}</p>
            {item.url && (
              <p>
                <a href={item.url}>{text.viewProject} ↗</a>
              </p>
            )}
            {item.sourceUrl && (
              <p>
                <a href={item.sourceUrl}>{text.sourceCode} ↗</a>
              </p>
            )}
          </>
        ),
        id: item.id,
        title: item.name,
      }));
    case "experience":
      return profile.experiences.map((item) => ({
        content: (
          <>
            {item.companyUrl ? <a href={item.companyUrl}>{item.company}</a> : item.company}
            <p>{period(item.start, item.end)}</p>
            <ul>
              {item.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </>
        ),
        id: item.id,
        title: item.position,
      }));
    case "education":
      return profile.education.map((item) => ({
        content: (
          <>
            {item.url ? <a href={item.url}>{item.institution}</a> : item.institution}
            <p>{period(item.start, item.end)}</p>
          </>
        ),
        id: item.id,
        title: `${item.degree} · ${item.field}`,
      }));
    case "skills":
      return Object.entries(profile.skills).map(([group, skills]) => ({
        content: <p>{skills.join(" · ")}</p>,
        id: group,
        title: group,
      }));
    case "languages":
      return profile.languages.map((item) => ({
        content: <p>{item.proficiency}</p>,
        id: item.id,
        title: item.language,
      }));
  }
}
export function ConfiguredSection({
  profile,
  section,
}: {
  profile: PortfolioProfile;
  section: PortfolioSection;
}) {
  if (!section.settings.visible) return null;
  const items = sectionItems(selectPortfolioContent(profile), section.kind);
  if (!items.length) return null;
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const label = section.kind === "languages" ? text.spokenLanguages : text[section.kind];
  const props = { items, label };
  return (
    <section
      className="folio-section configured-section"
      id={
        profile.portfolioType === "engineer" || !profile.portfolioType
          ? ({
              about: "about-me",
              education: "educations",
              experience: "experiences",
              languages: "languages",
              projects: "projects",
              skills: "skills",
            }[section.kind] ?? section.kind)
          : section.kind === "projects"
            ? "work"
            : section.kind
      }
    >
      <h2>{label}</h2>
      <SectionView renderer={section.renderer} {...props} />
    </section>
  );
}
function SectionView({
  renderer,
  items,
  label,
}: {
  renderer: SectionRendererId;
  items: SectionItem[];
  label: string;
}) {
  const view = sectionRendererViews[renderer];
  if (view === "timeline")
    return (
      <ol className="configured-timeline">
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        ))}
      </ol>
    );
  if (view === "accordion") return <SectionAccordion items={items} label={label} />;
  if (view === "tabs") return <SectionTabs items={items} label={label} />;
  if (view === "carousel") return <SectionCarousel items={items} label={label} />;
  if (view === "cards") return <SectionGrid items={items} label={label} />;
  if (view === "gallery") return <SectionGrid items={items} label={label} variant="gallery" />;
  return (
    <div>
      {items.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          {item.content}
        </article>
      ))}
    </div>
  );
}

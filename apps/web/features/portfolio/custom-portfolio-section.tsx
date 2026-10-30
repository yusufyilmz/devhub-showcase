import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs,
} from "@shared/components/section-views";
import { WorkMedia } from "@shared/components/work-media";
import {
  type CustomSection,
  getPortfolioCopy,
  getSocialWork,
  type Language,
} from "@shared/content";
import { RenderSection } from "@shared/sections/renderers";

export function CustomPortfolioSection({
  section,
  language,
  anchors,
  preview,
}: {
  section: CustomSection;
  language?: Language;
  preview?: boolean;
  anchors?: { id: string; title: string }[];
}) {
  if (section.sectionType)
    return (
      <RenderSection anchors={anchors} language={language} preview={preview} section={section} />
    );
  if (!section.visible || !section.items.length) return null;
  const text = getPortfolioCopy(language);
  const items: SectionItem[] = section.items.map((item) => ({
    content: (
      <>
        <WorkMedia
          imageUrl={item.imageUrl}
          loadLabel={text.loadVideo}
          title={item.title}
          unloadLabel={text.unloadVideo}
          youtubeId={section.composition === "youtube" ? getSocialWork(item.url)?.id : undefined}
        />
        {item.body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p
              className={section.composition === "testimonials" ? "testimonial-quote" : undefined}
              key={`${item.id}-${index}`}
              style={{ whiteSpace: "pre-line" }}
            >
              {paragraph}
            </p>
          ))}
        {/^https?:\/\//i.test(item.url) && <a href={item.url}>{item.title} ↗</a>}
      </>
    ),
    id: item.id,
    title: item.title,
  }));
  const props = { items, label: section.title };
  return (
    <section
      aria-labelledby={`${section.id}-heading`}
      className={`folio-section configured-section composition-${section.composition ?? "custom"}`}
      id={section.id}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <CustomView renderer={section.renderer} {...props} />
    </section>
  );
}
function CustomView({
  renderer,
  items,
  label,
}: {
  renderer: CustomSection["renderer"];
  items: SectionItem[];
  label: string;
}) {
  switch (renderer) {
    case "gallery":
    case "masonry":
      return <SectionGrid {...{ items, label }} variant="gallery" />;
    case "timeline":
    case "steps":
      return (
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              {item.content}
            </li>
          ))}
        </ol>
      );
    case "text":
    case "cards":
      return <SectionGrid items={items} label={label} />;
    case "accordion":
      return <SectionAccordion items={items} label={label} />;
    case "tabs":
      return <SectionTabs items={items} label={label} />;
    case "carousel":
      return <SectionCarousel items={items} label={label} />;
    case "list":
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
}

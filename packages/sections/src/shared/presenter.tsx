import type { ReactNode } from "react";

import { HeroSurface } from "@shared/components/hero-surface";
import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs,
} from "@shared/components/section-views";
import { WorkMedia } from "@shared/components/work-media";
import {
  type AuthorableSectionType,
  authorableSections,
  type CustomSection,
  getPortfolioCopy,
  getSocialWork,
} from "@shared/content";

import type { SectionProps } from "../types";
import { ContactForm, LocationMap } from "./interactive";

const safeLink = (url: string) => /^https?:\/\//i.test(url);
function ItemMedia({
  item,
  video,
  language,
}: {
  item: CustomSection["items"][number];
  video: boolean;
  language?: SectionProps["language"];
}) {
  const text = getPortfolioCopy(language);
  const work = getSocialWork(item.url);
  return video && safeLink(item.url) && /\.(mp4|webm|ogg)(\?|$)/i.test(item.url) ? (
    <video
      className="section-native-video"
      controls
      playsInline
      poster={item.imageUrl && safeLink(item.imageUrl) ? item.imageUrl : undefined}
      preload="none"
    >
      <source src={item.url} />
      <track
        default
        kind="captions"
        label="Captions"
        src={item.captionsUrl && safeLink(item.captionsUrl) ? item.captionsUrl : undefined}
      />
    </video>
  ) : (
    <WorkMedia
      imageUrl={item.imageUrl}
      loadLabel={text.loadVideo}
      title={item.title}
      unloadLabel={text.unloadVideo}
      youtubeId={video && work?.provider === "youtube" ? work.id : undefined}
    />
  );
}
export function ItemContent({
  item,
  quote = false,
  video = false,
  language,
}: {
  item: CustomSection["items"][number];
  quote?: boolean;
  video?: boolean;
  language?: SectionProps["language"];
}) {
  const prose = item.body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${item.id}-${index}`} style={{ whiteSpace: "pre-line" }}>
        {paragraph}
      </p>
    ));
  return (
    <>
      <ItemMedia item={item} language={language} video={video} />
      {item.value && <p className="section-item-value">{item.value}</p>}
      {item.period && <p className="section-item-period">{item.period}</p>}
      {quote ? <blockquote>{prose}</blockquote> : prose}
      {item.details?.length ? (
        <ul>
          {item.details.map((detail, index) => (
            <li key={`${item.id}-detail-${index}`}>{detail}</li>
          ))}
        </ul>
      ) : null}
      {item.code && (
        <pre>
          <code>{item.code}</code>
        </pre>
      )}
      {safeLink(item.url) && <a href={item.url}>{item.title} ↗</a>}
    </>
  );
}
export function CollectionView({
  section,
  type,
  language,
}: SectionProps & { type: AuthorableSectionType }) {
  const view = authorableSections[type].view;
  const items: SectionItem[] = section.items.map((item) => ({
    content: (
      <ItemContent
        item={item}
        language={language}
        quote={view === "quotes"}
        video={view === "video"}
      />
    ),
    id: item.id,
    title: item.title,
  }));
  const props = { items, label: section.title };
  if (section.renderer === "accordion") return <SectionAccordion {...props} />;
  if (section.renderer === "tabs") return <SectionTabs {...props} />;
  if (section.renderer === "carousel") return <SectionCarousel {...props} />;
  if (["gallery", "cards"].includes(section.renderer))
    return (
      <SectionGrid {...props} variant={section.renderer === "gallery" ? "gallery" : "cards"} />
    );
  if (section.renderer === "masonry")
    return (
      <div className="section-masonry">
        {items.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </article>
        ))}
      </div>
    );
  if (["steps", "timeline"].includes(section.renderer))
    return (
      <ol className={`section-${section.renderer}`}>
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        ))}
      </ol>
    );
  return (
    <div className="section-prose">
      {items.map((item) => (
        <article key={item.id}>
          {section.renderer !== "text" && <h3>{item.title}</h3>}
          {item.content}
        </article>
      ))}
    </div>
  );
}
export function SpecialView({
  section,
  type,
  anchors,
  language,
  preview,
}: SectionProps & { type: AuthorableSectionType }): ReactNode {
  const text = getPortfolioCopy(language);
  const options = section.options ?? {};
  switch (authorableSections[type].view) {
    case "contact":
      return options.email ? (
        preview ? (
          <div className="section-contact-form">
            <label>
              {text.formEmail}
              <input disabled type="email" />
            </label>
            <label>
              {text.formMessage}
              <textarea disabled rows={4} />
            </label>
            <button disabled type="button">
              {text.formOpenEmail}
            </button>
            <p>{text.formEmailNotice}</p>
          </div>
        ) : (
          <ContactForm email={options.email} language={language} />
        )
      ) : null;
    case "map":
      return options.latitude !== undefined && options.longitude !== undefined ? (
        <LocationMap
          latitude={options.latitude}
          longitude={options.longitude}
          title={section.title}
        />
      ) : null;
    case "toc":
      return (
        <nav aria-label={section.title}>
          <ol>
            {anchors
              ?.filter((item) => item.id !== section.id)
              .map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
          </ol>
        </nav>
      );
    case "newsletter":
      return options.actionUrl && safeLink(options.actionUrl) ? (
        <a className="section-action" href={options.actionUrl}>
          {text.subscribe} ↗
        </a>
      ) : null;
    case "heading":
      return null;
    default:
      return <CollectionView language={language} section={section} type={type} />;
  }
}
export function SectionPresentation({
  section,
  type,
  anchors,
  language,
  preview,
}: SectionProps & { type: AuthorableSectionType }) {
  if (!section.visible) return null;
  const view = authorableSections[type].view;
  if (
    !section.items.length &&
    !section.options?.description &&
    !["hero", "heading", "contact", "map", "toc", "newsletter"].includes(view)
  )
    return null;
  const frame = (
    <section
      aria-labelledby={`${section.id}-heading`}
      className={`folio-section configured-section library-section composition-${section.composition ?? type} section-type-${type} section-view-${view}`}
      data-alignment={section.options?.alignment ?? "left"}
      data-columns={section.options?.columns ?? 3}
      data-section-type={type}
      id={section.id}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.options?.description && (
        <p className="section-description">{section.options.description}</p>
      )}
      <SpecialView
        anchors={anchors}
        language={language}
        preview={preview}
        section={section}
        type={type}
      />
    </section>
  );
  return view === "hero" && section.options?.mediaUrl ? (
    <HeroSurface
      media={{
        kind: "image",
        overlay: "strong",
        position: "center",
        url: section.options.mediaUrl,
      }}
    >
      {frame}
    </HeroSurface>
  ) : (
    frame
  );
}

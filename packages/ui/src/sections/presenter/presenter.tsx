import "../sections.css";

import type { ReactNode } from "react";

import { authorableSections, getPortfolioCopy, getSocialWork } from "@shared/config";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { LocationMap } from "../../display/map";
import { WorkMedia } from "../../display/media";
import { ContactForm } from "../../forms/contact-form";
import { Input } from "../../forms/input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { Textarea } from "../../forms/textarea";
import { HeroSurface } from "../../layout/hero";
import type { SectionItem } from "../../layout/section";
import { SectionAccordion, SectionCarousel, SectionGrid, SectionTabs } from "../../layout/section";
import { GalleryCollection } from "../gallery-grid-section/GalleryCollection";
import {
  collectionViewClassName,
  presenterInlineStyle1,
  presenterStyles,
  sectionPresentationClassName,
} from "./styles";
import type {
  CollectionViewOptions,
  ItemContentOptions,
  ItemMediaOptions,
  SectionPresentationOptions,
  SpecialViewOptions,
} from "./types";

const safeLink = (url: string) => /^https?:\/\//i.test(url);
function ItemMedia({ item, video, language }: ItemMediaOptions) {
  const text = getPortfolioCopy(language);
  const work = getSocialWork(item.url);
  return video && safeLink(item.url) && /\.(mp4|webm|ogg)(\?|$)/i.test(item.url) ? (
    <video
      className={presenterStyles.element1}
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
export function ItemContent({ item, quote = false, video = false, language }: ItemContentOptions) {
  const prose = item.body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${item.id}-${index}`} style={presenterInlineStyle1}>
        {paragraph}
      </p>
    ));
  return (
    <>
      <ItemMedia item={item} language={language} video={video} />
      {item.value && <p className={presenterStyles.element2}>{item.value}</p>}
      {item.period && <p className={presenterStyles.element3}>{item.period}</p>}
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
export function CollectionView({ section, type, language }: CollectionViewOptions) {
  const view = authorableSections[type].view;
  if (
    type === "gallery-grid" &&
    section.items.length > 0 &&
    section.items.every((item) => item.imageUrl && safeLink(item.imageUrl))
  )
    return <GalleryCollection section={section} />;
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
  const props = { items, label: section.title, surface: "portfolio" as const };
  if (section.renderer === "accordion") return <SectionAccordion {...props} />;
  if (section.renderer === "tabs") return <SectionTabs {...props} />;
  if (section.renderer === "carousel") return <SectionCarousel {...props} />;
  if (["gallery", "cards"].includes(section.renderer))
    return (
      <SectionGrid {...props} variant={section.renderer === "gallery" ? "gallery" : "cards"} />
    );
  if (section.renderer === "masonry")
    return (
      <div className={presenterStyles.element4}>
        {items.map((item) => (
          <Card asChild key={item.id} layout="plain" surface="portfolio">
            <article>
              <h3>{item.title}</h3>
              {item.content}
            </article>
          </Card>
        ))}
      </div>
    );
  if (["steps", "timeline"].includes(section.renderer))
    return (
      <ol className={collectionViewClassName(section.renderer)}>
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        ))}
      </ol>
    );
  return (
    <div className={presenterStyles.element5}>
      {items.map((item) => (
        <Card asChild key={item.id} layout="plain" surface="portfolio">
          <article>
            {section.renderer !== "text" && <h3>{item.title}</h3>}
            {item.content}
          </article>
        </Card>
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
}: SpecialViewOptions): ReactNode {
  const text = getPortfolioCopy(language);
  const options = section.options ?? {};
  switch (authorableSections[type].view) {
    case "contact":
      return options.email ? (
        preview ? (
          <div className={presenterStyles.element6}>
            <LibraryLabel htmlFor="email" unstyled>
              {text.formEmail}
              <Input disabled id="email" type="email" />
            </LibraryLabel>
            <LibraryLabel htmlFor="message" unstyled>
              {text.formMessage}
              <Textarea disabled id="message" rows={4} />
            </LibraryLabel>
            <Button disabled id="open-email" type="button">
              {text.formOpenEmail}
            </Button>
            <p id="form-email-notice">{text.formEmailNotice}</p>
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
        <Button className={presenterStyles.element7} href={options.actionUrl}>
          {text.subscribe} ↗
        </Button>
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
}: SectionPresentationOptions) {
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
      className={sectionPresentationClassName(section.composition ?? type, type, view)}
      data-alignment={section.options?.alignment ?? "left"}
      data-columns={section.options?.columns ?? 3}
      data-section-type={type}
      id={section.id}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      {section.options?.description && (
        <p className={presenterStyles.element8}>{section.options.description}</p>
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

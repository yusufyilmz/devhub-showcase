import "../../styles/components/sections/sections.css";

import { authorableSections, getSocialWork } from "@shared/config";
import { safeLink } from "@shared/utils";

import { Card } from "../../cards";
import {
  MasonryGrid,
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs,
} from "../../layout";
import { GalleryCollection } from "../gallery-grid-section/GalleryCollection";
import { StepList } from "../how-to-section/StepList";
import { ItemMedia } from "../item-media/ItemMedia";
import { PlanCards } from "../plans-section/PlanCards";
import {
  collectionViewClassName,
  presenterInlineStyle1,
  presenterStyles,
} from "../section-presentation/styles";
import type { CollectionViewOptions, ItemContentOptions } from "../section-presentation/types";
import { TestimonialCards } from "../testimonials-section/TestimonialCards";

export function ItemContent({
  item,
  quote = false,
  video = false,
  language,
  hideLink = false,
}: ItemContentOptions) {
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
      {!hideLink && safeLink(item.url) && !getSocialWork(item.url) && (
        <a href={item.url}>{item.title} ↗</a>
      )}
    </>
  );
}

export function CollectionView({ section, type, language }: CollectionViewOptions) {
  const view = authorableSections[type].view;
  if (section.renderer === "cards" && view === "pricing")
    return <PlanCards language={language} section={section} />;
  if (section.renderer === "cards" && view === "quotes")
    return <TestimonialCards section={section} />;
  if (
    type === "gallery-grid" &&
    section.renderer === "gallery" &&
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
      <MasonryGrid columns={section.options?.columns}>
        {items.map((item) => (
          <Card asChild key={item.id} layout="plain" surface="portfolio">
            <article className="grid gap-xs p-[1.25rem]">
              <h3>{item.title}</h3>
              {item.content}
            </article>
          </Card>
        ))}
      </MasonryGrid>
    );
  if (section.renderer === "steps") return <StepList items={items} />;
  if (section.renderer === "timeline")
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

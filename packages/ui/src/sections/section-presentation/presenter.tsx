import "../../styles/components/sections/sections.css";

import type { ReactNode } from "react";

import { authorableSections, getPortfolioCopy } from "@shared/config";
import { safeLink } from "@shared/utils";

import { Button } from "../../buttons/button";
import { LocationMap } from "../../display/map";
import { ContactForm } from "../../forms/contact-form";
import { HeroSurface } from "../../layout/hero";
import { CollectionView } from "../collection-view/CollectionView";
import { presenterStyles, sectionPresentationClassName } from "./styles";
import type { SectionPresentationOptions, SpecialViewOptions } from "./types";

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
        <ContactForm email={options.email} language={language} preview={preview} />
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

import "@shared/ui/sections.css";

import type { ReactNode } from "react";

import { ArrowUpRight, Mail } from "lucide-react";

import { authorableSections, getPortfolioCopy } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { ContactForm } from "@shared/ui/contact-form";
import { HeroSurface } from "@shared/ui/layout";
import { LocationMap } from "@shared/ui/map";
import { safeLink } from "@shared/utils";

import { CollectionView } from "../collection-view/CollectionView";
import { DashboardContent } from "../dashboard-section/DashboardContent";
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
    case "dashboard":
      return <DashboardContent section={section} />;
    case "newsletter":
      return options.actionUrl && safeLink(options.actionUrl) ? (
        <Button className="w-fit" endIcon={<ArrowUpRight />} href={options.actionUrl}>
          {text.subscribe}
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
  const headingId = `${section.id}-heading`;
  const className = sectionPresentationClassName(section.composition ?? type, type, view);
  if (view === "newsletter") {
    return (
      <section
        aria-labelledby={headingId}
        className={className}
        data-alignment={section.options?.alignment ?? "left"}
        data-section-type={type}
        id={section.id}
      >
        <Card
          className="grid gap-md bg-linear-to-br from-primary/10 via-card to-card p-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-xl"
          interaction="static"
          layout="plain"
        >
          <div>
            <Mail aria-hidden="true" className="mb-s size-6 text-primary" />
            <h2 id={headingId}>{section.title}</h2>
            {section.options?.description && <p>{section.options.description}</p>}
          </div>
          <SpecialView
            anchors={anchors}
            language={language}
            preview={preview}
            section={section}
            type={type}
          />
        </Card>
      </section>
    );
  }
  const frame = (
    <section
      aria-labelledby={headingId}
      className={className}
      data-alignment={section.options?.alignment ?? "left"}
      data-columns={section.options?.columns ?? 3}
      data-section-type={type}
      id={section.id}
    >
      <h2 id={headingId}>{section.title}</h2>
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

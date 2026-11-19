import "../section/sections.css";

import type { ReactNode } from "react";

import { cn } from "cn";
import { ArrowUpRight, Mail } from "lucide-react";

import { authorableSections, getPortfolioCopy } from "@shared/config";
import { safeLink } from "@shared/utils";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { LocationMap } from "../../display";
import { ContactForm } from "../../forms";
import { HeroSurface } from "../../layout";
import { CollectionView } from "../collection-view/CollectionView";
import { DashboardContent } from "../dashboard-section/DashboardContent";
import { SectionFrame, sectionFrameProseClassName } from "../section/section-frame";
import { SectionHeading } from "../section/section-heading";
import { presenterStyles, sectionPresentationClassName } from "./styles";
import type { SectionPresentationOptions, SpecialViewOptions } from "./types";

const framedSectionTypes = new Set([
  "about",
  "about-hero",
  "awards",
  "careers",
  "clients",
  "gallery-grid",
  "heading",
  "instagram",
  "pinterest",
  "legal-text",
  "profile",
  "showcase",
  "studies",
  "text",
  "timeline",
  "video",
  "work-experience",
  "youtube",
]);

function FramedIntro({ anchors, language, preview, section, type }: SectionPresentationOptions) {
  const view = authorableSections[type].view;
  const alignment = section.options?.alignment ?? "left";
  const frame = (
    <SectionFrame
      className={cn(
        "scroll-mt-24",
        alignment === "center" && "text-center",
        alignment === "right" && "text-end",
      )}
      context="composed"
      heading={
        <SectionHeading
          description={section.options?.description}
          id={`${section.id}-heading`}
          level={2}
          title={section.title}
        />
      }
      id={section.id}
      sectionType={type}
      width={type === "text" || type === "legal-text" ? "reading" : "contained"}
    >
      <div className={type === "heading" ? undefined : sectionFrameProseClassName}>
        <SpecialView
          anchors={anchors}
          language={language}
          preview={preview}
          section={section}
          type={type}
        />
      </div>
    </SectionFrame>
  );
  if (view === "hero" && section.options?.mediaUrl) {
    return (
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
    );
  }
  return frame;
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
  if (framedSectionTypes.has(type)) {
    return (
      <FramedIntro
        anchors={anchors}
        language={language}
        preview={preview}
        section={section}
        type={type}
      />
    );
  }
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

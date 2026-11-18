import { authorableSections, authorableSectionTypes, type CustomSection } from "@shared/config";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { LibraryPicker } from "../live-section-preview/library-picker";
import { LiveSectionPreview } from "../live-section-preview/live-section-preview";
import { sectionExamples } from "../live-section-preview/preview-examples";
import { SectionCatalogPreview } from "../live-section-preview/section-catalog-preview";
import { SectionGallery } from "../live-section-preview/section-gallery";
import { Section } from "../section";
import { type CardButton, cardButton } from "./card-buttons";
import { libraryStyles, pricingStyles } from "./styles";
import type { HomeLibrarySectionOptions } from "./types";

type LibraryCard = {
  articleClass?: string;
  button: CardButton;
  buttonClass: string;
  description?: string;
  eyebrow: string;
  eyebrowAs?: "span";
  eyebrowClass: string;
  id: string;
  note?: string;
  title: string;
  points?: readonly string[];
  variant?: "link" | "outline";
};

const samples: CustomSection[] = [
  {
    id: "custom-home-services",
    items: [
      {
        body: "From a first idea to a clear visual story.",
        id: "strategy",
        title: "Creative direction",
        url: "",
      },
      {
        body: "Thoughtful websites and products built around people.",
        id: "build",
        title: "Digital experiences",
        url: "",
      },
    ],
    renderer: "cards",
    sectionType: "services",
    title: "Make room for what you do",
    visible: true,
  },
  {
    id: "custom-home-timeline",
    items: [
      {
        body: "Building brands for people with a point of view.",
        id: "now",
        period: "2024 · Present",
        title: "Independent designer",
        url: "",
      },
      {
        body: "A chapter of learning, making and growing.",
        id: "before",
        period: "2021 · 2024",
        title: "Studio collaborator",
        url: "",
      },
    ],
    renderer: "timeline",
    sectionType: "timeline",
    title: "Show the journey",
    visible: true,
  },
  {
    id: "custom-home-gallery",
    items: [
      {
        body: "A fictional brand exploration.",
        id: "orbit",
        imageUrl: "/examples/orbit-brand.svg",
        title: "Orbit identity",
        url: "",
      },
      {
        body: "A fictional digital studio concept.",
        id: "atelier",
        imageUrl: "/examples/atlas-interface.svg",
        title: "Atelier website",
        url: "",
      },
    ],
    renderer: "gallery",
    sectionType: "gallery-grid",
    title: "Let the work speak",
    visible: true,
  },
  {
    id: "custom-home-faq",
    items: [
      {
        body: "Start with a conversation about your goals and ideas.",
        id: "collaboration",
        title: "How do we start working together?",
        url: "",
      },
      {
        body: "Listen, explore, build and refine together.",
        id: "approach",
        title: "What is your approach?",
        url: "",
      },
    ],
    renderer: "accordion",
    sectionType: "faq",
    title: "A little more context",
    visible: true,
  },
];

const libraryCards: LibraryCard[] = [
  {
    articleClass: pricingStyles.element5,
    button: "cv",
    buttonClass: libraryStyles.element8,
    description:
      "Upload a PDF, DOCX or text CV. OpenAI extracts the details for you to review and edit. Apply only what you want, then save when you are ready.",
    eyebrow: "START WITH WHAT YOU HAVE",
    eyebrowAs: "span",
    eyebrowClass: libraryStyles.element7,
    id: "cv-import",
    note: "Sign in first. Import availability depends on the service configuration. Nothing is published automatically.",
    title: "Your CV, a new beginning.",
  },
  {
    articleClass: pricingStyles.element5,
    button: "templates",
    buttonClass: libraryStyles.element11,
    description:
      "Save section configurations as private templates, export them as JSON, or review a compatible PageForge import. Include authored content only when you choose to.",
    eyebrow: "KEEP YOUR FAVORITES",
    eyebrowAs: "span",
    eyebrowClass: libraryStyles.element10,
    id: "templates",
    points: [
      "Private template library",
      "Review before replacing or adding sections",
      "Keep your identity and sharing settings",
    ],
    title: "A starting point you can reuse.",
    variant: "link",
  },
];

const featuredExamples = samples.map((section) => {
  const exampleId = section.sectionType ?? "custom";
  return {
    content: <LiveSectionPreview embedded exampleId={exampleId} section={section} />,
    description: section.title,
    id: exampleId,
    thumbnail: <SectionCatalogPreview type={exampleId} />,
    title: authorableSections[exampleId].name,
  };
});

const featuredIds = new Set<string>(featuredExamples.map(({ id }) => id));
const libraryExamples = [
  ...featuredExamples,
  ...sectionExamples
    .filter(({ id }) => !featuredIds.has(id))
    .map(({ id, name, description }) => ({
      content: <LiveSectionPreview embedded exampleId={id} />,
      description,
      id,
      thumbnail: <SectionCatalogPreview type={id} />,
      title: name,
    })),
];

export function HomeLibrarySection({ action }: HomeLibrarySectionOptions) {
  return (
    <Section asChild>
      <section
        aria-labelledby="library-title"
        className={libraryStyles.element1}
        id="section-library"
      >
        <div className={libraryStyles.element2}>
          <div className={libraryStyles.element3}>
            <p className={libraryStyles.element4}>BUILD IT YOUR WAY</p>
            <h2 id="library-title">
              Your story.
              <br />
              <span>More ways to tell it.</span>
            </h2>
            <p>
              Choose from {authorableSectionTypes.length} section types. Mix galleries, timelines,
              services, FAQs, video and more. Reorder them, choose their layout or add a section of
              your own.
            </p>
          </div>
          <div className={libraryStyles.element5}>
            <strong>
              {authorableSectionTypes.length}
              <span>section types</span>
            </strong>
            <p>A place for every part of your story.</p>
            <span>SELECT · ARRANGE · MAKE IT YOURS</span>
          </div>
        </div>
        <LibraryPicker items={libraryExamples} />
        <div className="mt-md flex justify-center">
          <SectionGallery />
        </div>
        <div className={libraryStyles.element6}>
          {libraryCards.map((card) => {
            const button = cardButton(card.button, action);
            return (
              <Card asChild key={card.id} layout="plain" surface="portfolio">
                <article className={card.articleClass}>
                  {card.eyebrowAs === "span" ? (
                    <span className={card.eyebrowClass}>{card.eyebrow}</span>
                  ) : (
                    <p className={card.eyebrowClass}>{card.eyebrow}</p>
                  )}
                  <h3>{card.title}</h3>
                  {card.description ? <p>{card.description}</p> : null}
                  <Button className={card.buttonClass} href={button.href} variant={card.variant}>
                    {button.label}
                  </Button>
                  {card.note ? <p className={libraryStyles.element9}>{card.note}</p> : null}
                </article>
              </Card>
            );
          })}
        </div>
      </section>
    </Section>
  );
}

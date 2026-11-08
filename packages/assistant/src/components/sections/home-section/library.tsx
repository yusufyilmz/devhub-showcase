import { authorableSections, authorableSectionTypes, type CustomSection } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Section } from "@shared/ui/section";

import { RenderSection } from "../renderers";
import { LibraryPicker } from "./library-picker";
import { SectionCatalog } from "./section-catalog";
import { libraryStyles } from "./styles";
import type { HomeLibrarySectionOptions } from "./types";

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

export function HomeLibrarySection({ href }: HomeLibrarySectionOptions) {
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
        <LibraryPicker
          items={samples.map((section) => ({
            content: <RenderSection preview section={section} />,
            description: section.title,
            id: section.sectionType ?? "custom",
            title: authorableSections[section.sectionType ?? "custom"].name,
          }))}
        />
        <SectionCatalog />
        <div className={libraryStyles.element6}>
          <Card asChild layout="plain" surface="portfolio">
            <article>
              <span className={libraryStyles.element7}>START WITH WHAT YOU HAVE</span>
              <h3>Your CV, a new beginning.</h3>
              <p>
                Upload a PDF, DOCX or text CV. OpenAI extracts the details for you to review and
                edit. Apply only what you want, then save when you are ready.
              </p>
              <Button className={libraryStyles.element8} href={href}>
                Start with your CV <span aria-hidden="true">↗</span>
              </Button>
              <p className={libraryStyles.element9}>
                Sign in first. Import availability depends on the service configuration. Nothing is
                published automatically.
              </p>
            </article>
          </Card>
          <Card asChild layout="plain" surface="portfolio">
            <article>
              <span className={libraryStyles.element10}>KEEP YOUR FAVORITES</span>
              <h3>A starting point you can reuse.</h3>
              <p>
                Save section configurations as private templates, export them as JSON, or review a
                compatible PageForge import. Include authored content only when you choose to.
              </p>
              <ul>
                <li>Private template library</li>
                <li>Review before replacing or adding sections</li>
                <li>Keep your identity and sharing settings</li>
              </ul>
              <Button className={libraryStyles.element11} href={href} variant="link">
                Explore your studio →
              </Button>
            </article>
          </Card>
        </div>
      </section>
    </Section>
  );
}

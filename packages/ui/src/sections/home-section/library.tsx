import { authorableSectionTypes } from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { SectionCatalog } from "../live-section-preview/section-catalog";
import { Section } from "../section";
import { libraryStyles } from "./styles";
import type { HomeLibrarySectionOptions } from "./types";

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

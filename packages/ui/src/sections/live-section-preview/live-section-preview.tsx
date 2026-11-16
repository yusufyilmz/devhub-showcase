"use client";

import { type ReactNode, useId } from "react";

import { PassiveSectionPreview } from "../../providers/passive-section-preview";
import { AboutMeSection } from "../about-me-section";
import { CVSection } from "../cv-section";
import { EducationsSection } from "../education-section";
import { ExperienceSection } from "../experience-section";
import { ProjectsSection } from "../project-section";
import { ReferralSection } from "../referral-section";
import { SkillSection } from "../skills-section";
import { ConfiguredSection } from "../studio/configured-section";
import { CustomPortfolioSection } from "../studio/custom-portfolio-section";
import { SummarySection } from "../summary-section";
import type { SectionProps } from "../types";
import {
  portfolioSectionExamples as examples,
  type SectionExampleId,
  sectionExamples,
  type viewOnlySectionExamples,
} from "./preview-examples";
import { createSectionExample } from "./section-example";

export type LiveSectionPreviewProps = Pick<SectionProps, "anchors" | "language"> & {
  exampleId: SectionExampleId;
  section?: SectionProps["section"];
  assetUrl?: (file: string) => string;
  embedded?: boolean;
};

const viewOnly: Record<keyof typeof viewOnlySectionExamples, () => ReactNode> = {
  "about-me": () => <AboutMeSection profile={examples.profile} />,
  cv: () => <CVSection />,
  education: () => <EducationsSection educations={[examples.education]} />,
  experience: () => <ExperienceSection experiences={[examples.experience]} />,
  languages: () => (
    <ConfiguredSection
      profile={examples.profile}
      section={{
        id: "languages",
        kind: "languages",
        renderer: "language-list",
        settings: { visible: true },
        source: { field: "languages", type: "profile" },
      }}
    />
  ),
  "portfolio-projects": () => <ProjectsSection projects={[examples.project]} />,
  referrals: () => <ReferralSection referrals={[examples.referral]} />,
  skills: () => <SkillSection skills={{ Design: [examples.skill] }} />,
  summary: () => <SummarySection profile={examples.profile} />,
};

function isViewOnly(id: SectionExampleId): id is keyof typeof viewOnlySectionExamples {
  return Object.hasOwn(viewOnly, id);
}

export function LiveSectionPreview({
  exampleId,
  section,
  language,
  anchors,
  assetUrl,
  embedded = false,
}: LiveSectionPreviewProps) {
  const instanceId = useId();
  const descriptor = sectionExamples.find(({ id }) => id === exampleId);
  const sample =
    !section && !isViewOnly(exampleId)
      ? createSectionExample(exampleId, "default", assetUrl)
      : undefined;
  const renderedSection = section ?? sample?.section;
  const previewAnchors = (anchors ?? sample?.anchors)?.map((anchor) => ({
    ...anchor,
    id: `${instanceId}-${anchor.id}`,
  }));
  const content = renderedSection ? (
    <CustomPortfolioSection
      anchors={previewAnchors}
      language={language}
      preview
      section={{ ...renderedSection, id: `custom-preview-${instanceId}` }}
    />
  ) : isViewOnly(exampleId) ? (
    viewOnly[exampleId]()
  ) : null;

  const blockNavigation = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a[href]")) event.preventDefault();
  };

  if (embedded) {
    return (
      <PassiveSectionPreview.Provider value>
        <div className="min-w-0 wrap-anywhere" onClickCapture={blockNavigation}>
          {content}
        </div>
      </PassiveSectionPreview.Provider>
    );
  }

  return (
    <section
      aria-label={
        section ? `${section.title} section preview` : `${descriptor?.name} section example`
      }
      className="min-w-0 rounded-xl border border-border/75 bg-card text-card-foreground"
      onClickCapture={blockNavigation}
    >
      <div className="border-b border-border/70 px-md py-s text-xs font-medium tracking-wide text-muted-foreground">
        Live section preview
      </div>
      <PassiveSectionPreview.Provider value>
        <div className="min-w-0 wrap-anywhere px-md sm:px-lg">{content}</div>
      </PassiveSectionPreview.Provider>
    </section>
  );
}

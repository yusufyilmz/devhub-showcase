import { Fragment, type ReactNode } from "react";

import {
  getPortfolioEntries,
  type PortfolioProfile,
  portfolioSectionLabels,
  resolveSectionSource,
  type SectionRendererId,
} from "@shared/content";

import { ConfiguredSection } from "./configured-section";
import { CustomPortfolioSection } from "./custom-portfolio-section";

/** Server component: only explicit React implementations can render saved content. */
export function RegisteredSections({
  profile,
  renderers,
}: {
  profile: PortfolioProfile;
  renderers: Partial<Record<SectionRendererId, ReactNode>>;
}) {
  const entries = getPortfolioEntries(profile);
  const engineer = !profile.portfolioType || profile.portfolioType === "engineer";
  const builtinAnchors = {
    about: engineer ? "about-me" : "about",
    education: engineer ? "educations" : "education",
    experience: engineer ? "experiences" : "experience",
    languages: "languages",
    projects: engineer ? "projects" : "work",
    skills: "skills",
  };
  const anchors = entries
    .filter((entry) => (entry.kind === "custom" ? entry.visible : entry.settings.visible))
    .map((entry) => ({
      id: entry.kind === "custom" ? entry.id : builtinAnchors[entry.kind],
      title: entry.kind === "custom" ? entry.title : portfolioSectionLabels[entry.kind],
    }));
  return entries.map((section) => {
    if (section.kind === "custom")
      return (
        <CustomPortfolioSection
          anchors={anchors}
          key={section.id}
          language={profile.portfolioLanguage}
          section={resolveSectionSource(section, profile)}
        />
      );
    if (!section.settings.visible) return null;
    if (profile.sectionSettings?.[section.kind]?.renderer)
      return <ConfiguredSection key={section.id} profile={profile} section={section} />;
    if (!Object.hasOwn(renderers, section.renderer))
      throw new Error(`Missing portfolio renderer: ${section.renderer}`);
    return section.settings.visible ? (
      <Fragment key={section.id}>{renderers[section.renderer]}</Fragment>
    ) : null;
  });
}

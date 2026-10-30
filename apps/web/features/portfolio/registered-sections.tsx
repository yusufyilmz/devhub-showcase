import {
  getPortfolioEntries,
  type PortfolioProfile,
  portfolioSectionLabels,
  resolveSectionSource,
  type SectionRendererId,
} from "@shared/content";
import { Fragment, type ReactNode } from "react";
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
  const engineer =
    !profile.portfolioType || profile.portfolioType === "engineer";
  const builtinAnchors = {
    about: engineer ? "about-me" : "about",
    experience: engineer ? "experiences" : "experience",
    projects: engineer ? "projects" : "work",
    skills: "skills",
    education: engineer ? "educations" : "education",
    languages: "languages",
  };
  const anchors = entries
    .filter((entry) =>
      entry.kind === "custom" ? entry.visible : entry.settings.visible,
    )
    .map((entry) => ({
      id: entry.kind === "custom" ? entry.id : builtinAnchors[entry.kind],
      title:
        entry.kind === "custom"
          ? entry.title
          : portfolioSectionLabels[entry.kind],
    }));
  return entries.map((section) => {
    if (section.kind === "custom")
      return (
        <CustomPortfolioSection
          key={section.id}
          section={resolveSectionSource(section, profile)}
          anchors={anchors}
          language={profile.portfolioLanguage}
        />
      );
    if (!section.settings.visible) return null;
    if (profile.sectionSettings?.[section.kind]?.renderer)
      return (
        <ConfiguredSection
          key={section.id}
          profile={profile}
          section={section}
        />
      );
    if (!Object.hasOwn(renderers, section.renderer))
      throw new Error(`Missing portfolio renderer: ${section.renderer}`);
    return section.settings.visible ? (
      <Fragment key={section.id}>{renderers[section.renderer]}</Fragment>
    ) : null;
  });
}

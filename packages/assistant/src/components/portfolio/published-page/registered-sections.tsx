import { Fragment, type ReactNode } from "react";

import {
  getPortfolioEntries,
  getSectionItems,
  type PortfolioEntryId,
  type PortfolioProfile,
  portfolioSectionLabels,
  resolveSectionSource,
  type SectionRendererId,
} from "@shared/config";

import { SortableList } from "../../editors/sortable-list";
import { ConfiguredSection, CustomPortfolioSection } from "../../sections/studio/index";

export type ArrangePortfolioSections = {
  disabled?: boolean;
  onChange: (visibleOrder: PortfolioEntryId[]) => void;
};
export function RegisteredSections({
  profile,
  renderers,
  arrange,
}: {
  arrange?: ArrangePortfolioSections;
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
  type Entry = (typeof entries)[number];

  function renderCustom(section: Extract<Entry, { kind: "custom" }>) {
    if (!section.visible) return null;
    const resolved = resolveSectionSource(section, profile);
    if (!resolved.sectionType && !resolved.items.length) return null;
    return (
      <CustomPortfolioSection
        anchors={anchors}
        language={profile.portfolioLanguage}
        section={resolved}
      />
    );
  }

  function render(section: Entry) {
    if (section.kind === "custom") return renderCustom(section);
    if (!section.settings.visible) return null;
    if (profile.sectionSettings?.[section.kind]?.renderer) {
      if (arrange && section.kind !== "about" && !getSectionItems(profile, section.kind).length)
        return null;
      return <ConfiguredSection profile={profile} section={section} />;
    }
    if (!Object.hasOwn(renderers, section.renderer))
      throw new Error(`Missing portfolio renderer: ${section.renderer}`);
    return renderers[section.renderer];
  }

  const sections = entries.flatMap((entry) => {
    const content = render(entry);
    if (!content) return [];
    return [
      {
        content,
        id: entry.id,
        label: entry.kind === "custom" ? entry.title : portfolioSectionLabels[entry.kind],
      },
    ];
  });
  if (!arrange) return sections.map(({ content, id }) => <Fragment key={id}>{content}</Fragment>);

  const byId = new Map<string, (typeof sections)[number]>(
    sections.map((section) => [section.id, section]),
  );
  return (
    <SortableList
      disabled={arrange.disabled}
      items={sections}
      label="Arrange portfolio sections"
      onChange={(ids) =>
        arrange.onChange(
          ids.flatMap((id) => {
            const section = byId.get(id);
            return section ? [section.id] : [];
          }),
        )
      }
      renderContent={(id) => byId.get(id)?.content}
    />
  );
}

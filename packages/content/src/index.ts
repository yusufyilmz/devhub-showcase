export { getNameInitials } from "./branding";

import { chatMessages } from "./chat-messages";
import { aboutSection } from "./site-copy/about";
import { chat } from "./site-copy/chat";
import { cta } from "./site-copy/cta";
import { cvSection } from "./site-copy/cv";
import { errorPage } from "./site-copy/errorPage";
import { footer } from "./site-copy/footer";
import { header } from "./site-copy/header";
import { metadata } from "./site-copy/meta-data";
import { navbar } from "./site-copy/navbar";
import { notFoundPage } from "./site-copy/notFoundPage";
import { notifications } from "./site-copy/notifications";
import { project } from "./site-copy/project";
import { structuredData } from "./site-copy/structured-data";

export const copy = {
  aboutSection,
  chat,
  chatMessages,
  cta,
  cvSection,
  errorPage,
  footer,
  header,
  metadata,
  navbar,
  notFoundPage,
  notifications,
  project,
  structuredData,
};

export type {
  AuthorableSectionType,
  SectionOptions,
  SectionSource,
  SectionSourceField,
} from "./authorable-sections";
export {
  authorableSections,
  authorableSectionTypes,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
} from "./authorable-sections";
export type {
  CustomSection,
  CustomSectionId,
  PortfolioEntryId,
} from "./custom-sections";
export { customSectionViews, getPortfolioEntries } from "./custom-sections";
export type { Language, PortfolioMessages } from "./languages";
export {
  formatPortfolioPeriod,
  getPortfolioCopy,
  languages,
} from "./languages";
export type { PortfolioSectionId } from "./portfolio-sections";
export {
  getPortfolioSectionOrder,
  getPortfolioSections,
  portfolioSectionIds,
  portfolioSectionLabels,
} from "./portfolio-sections";
export type { CvLayout, PortfolioType } from "./portfolio-types";
export { cvLayouts, portfolioTypes } from "./portfolio-types";
export type { PortfolioProfile } from "./profile";
export { profile } from "./profile";
export type { SectionComposition } from "./section-compositions";
export {
  getSocialWork,
  sectionCompositionIds,
  sectionCompositions,
} from "./section-compositions";
export { getSectionItems, selectPortfolioContent } from "./section-content";
export type {
  PortfolioSection,
  PortfolioSectionSettings,
  SectionRendererId,
} from "./section-registry";
export { sectionRegistry, sectionRendererViews } from "./section-registry";
export { resolveSectionSource } from "./section-source";
export type {
  SavedSectionTemplate,
  SectionTemplateFile,
} from "./section-templates";
export type { ColorMode, PortfolioTheme } from "./themes";
export {
  getPortfolioThemeVariables,
  getPreviewAccent,
  getThemePalette,
  portfolioAccents,
  portfolioThemes,
} from "./themes";

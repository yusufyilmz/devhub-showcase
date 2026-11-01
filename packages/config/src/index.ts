export { CHATSIZE, dataStyle, effects, style } from "./constants";
export { getNameInitials } from "./profile/branding";

import { chatMessages } from "./copy/chat-messages";
import { aboutSection } from "./copy/site-copy/about";
import { chat } from "./copy/site-copy/chat";
import { cta } from "./copy/site-copy/cta";
import { cvSection } from "./copy/site-copy/cv";
import { errorPage } from "./copy/site-copy/errorPage";
import { footer } from "./copy/site-copy/footer";
import { header } from "./copy/site-copy/header";
import { metadata } from "./copy/site-copy/meta-data";
import { navbar } from "./copy/site-copy/navbar";
import { notFoundPage } from "./copy/site-copy/notFoundPage";
import { notifications } from "./copy/site-copy/notifications";
import { project } from "./copy/site-copy/project";
import { structuredData } from "./copy/site-copy/structured-data";

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

export type { Language, PortfolioMessages } from "./portfolio/languages";
export {
  formatPortfolioPeriod,
  getPortfolioCopy,
  languages,
} from "./portfolio/languages";
export type { PortfolioSectionId } from "./portfolio/portfolio-sections";
export {
  getPortfolioSectionOrder,
  getPortfolioSections,
  portfolioSectionIds,
  portfolioSectionLabels,
} from "./portfolio/portfolio-sections";
export type { CvLayout, PortfolioType } from "./portfolio/portfolio-types";
export { cvLayouts, portfolioTypes } from "./portfolio/portfolio-types";
export type { ColorMode, PortfolioTheme } from "./portfolio/themes";
export {
  getPortfolioThemeVariables,
  getPreviewAccent,
  getThemePalette,
  portfolioAccents,
  portfolioThemes,
} from "./portfolio/themes";
export type { PortfolioProfile } from "./profile/profile";
export { profile } from "./profile/profile";
export type {
  AuthorableSectionType,
  SectionOptions,
  SectionSource,
  SectionSourceField,
} from "./sections/authorable-sections";
export {
  authorableSections,
  authorableSectionTypes,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
} from "./sections/authorable-sections";
export type {
  CustomSection,
  CustomSectionId,
  PortfolioEntryId,
} from "./sections/custom-sections";
export { customSectionViews, getPortfolioEntries } from "./sections/custom-sections";
export type { SectionComposition } from "./sections/section-compositions";
export {
  getSocialWork,
  sectionCompositionIds,
  sectionCompositions,
} from "./sections/section-compositions";
export { getSectionItems, selectPortfolioContent } from "./sections/section-content";
export type {
  PortfolioSection,
  PortfolioSectionSettings,
  SectionRendererId,
} from "./sections/section-registry";
export { sectionRegistry, sectionRendererViews } from "./sections/section-registry";
export { resolveSectionSource } from "./sections/section-source";
export type {
  SavedSectionTemplate,
  SectionTemplateFile,
} from "./sections/section-templates";
